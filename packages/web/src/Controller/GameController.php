<?php 
namespace App\Controller;

use App\Model\Game;
use App\Entity\Game as GameEntity;
use App\Model\Piece;
use App\Repository\GameRepository;
use App\Service\LinkxRules as ServiceLinkxRules;
use App\Service\StateUpdater;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;

class GameController extends AbstractController
{

    public function __construct(
        private StateUpdater $stateUpdater,
        private ServiceLinkxRules $rulesService,
        private GameRepository $gameRepository,
        private EntityManagerInterface $em,
    )
    {
    }


    #[Route('/')]
    public function home(Request $request, SessionInterface $session): Response
    {
        return $this->render("landing.html.twig");
    }

    #[Route('/game')]
    public function state(Request $request, SessionInterface $session): Response
    {
        $state = $request->query->get("state");
        $selected = $request->query->get("selected");
        $selectedMirrored = $request->query->get("mirror-piece") ?? false;
        $selectedRotation = $this->formatRotation($request->query->get("rotate-piece"));
        $column = $request->query->get("column");

        [$render] = $this->runAndRenderGame($session, null, $state, $selected, $selectedMirrored, $selectedRotation, $column, null, null);

        return $render;
    }

    #[Route('/online-game', methods: ['POST'])]
    public function createOnlineGame(Request $request, SessionInterface $session): Response
    {
        $csrfToken = $request->getPayload()->get('csrf-token');
        if (!$this->isCsrfTokenValid('create-game', $csrfToken)) {
            $this->render('error.html.twig', [
                'message' => "Invalid CSRF token provided.",
            ]);
        }

        if (empty($session->get("playerId"))) {
            $session->set("playerId", uniqid());
        }
        $gameEntity = new GameEntity();
        $gameEntity->setPlayer1Sessid($session->get("playerId"));
        $this->em->persist($gameEntity);
        $this->em->flush();

        return $this->redirect("/online-game/{$gameEntity->getId()}");
    }

    #[Route('/online-game/{id}', methods: ['GET', 'POST'])]
    public function onlineGame(Request $request, SessionInterface $session, GameEntity $gameEntity): Response
    {
        if (empty($session->get("playerId"))) {
            $session->set("playerId", uniqid());
        }
        if (is_null($gameEntity->getPlayer2Sessid())
            && $gameEntity->getPlayer1Sessid() !== $session->get("playerId")) {
            if (!empty($request->getPayload()->get('join'))) {
                $csrfToken = $request->getPayload()->get('csrf-token');
                if (!$this->isCsrfTokenValid('join-game', $csrfToken)) {
                    $this->render('error.html.twig', [
                        'message' => "Invalid CSRF token provided.",
                    ]);
                }
                $gameEntity->setPlayer2Sessid($session->get("playerId"));
            } else {
                return $this->render('join-game.html.twig', [
                    'id' => $gameEntity->getId(),
                ]);
            }
        } else if ($gameEntity->getPlayer1Sessid() !== $session->get("playerId")
            && $gameEntity->getPlayer2Sessid() !== $session->get("playerId")) {
            $infoMessage = "You are a spectator of this game.";
        }

        $selected = $request->query->get("selected");
        $selectedMirrored = $request->query->get("mirror-piece") ?? false;
        $selectedRotation = $this->formatRotation($request->query->get("rotate-piece"));
        $column = $request->query->get("column");

        [$render, $state] = $this->runAndRenderGame(
            $session,
            $gameEntity,
            $gameEntity->getState(),
            $selected, 
            $selectedMirrored,
            $selectedRotation,
            $column,
            null,
            $infoMessage ?? null,
        );

        $gameEntity->setState($state);
        if ($gameEntity->getPlayer1Sessid() === $session->get("playerId")
            || $gameEntity->getPlayer2Sessid() === $session->get("playerId")) {
            $this->em->flush();
        }

        return $render;
    }

    private function runAndRenderGame(
        SessionInterface $session,
        ?GameEntity $gameEntity,
        ?string $state,
        ?string $selected,
        ?bool $selectedMirrored,
        ?int $selectedRotation,
        ?string $column,
        ?string $errorMessage,
        ?string $infoMessage)
    {
        try {
            $game = $this->rulesService->getGameFromStringState($state);
            
            if (!empty($gameEntity)) {
                $sessidOfTurnPlayer = $game->getTurnOfPlayer() === "blue" 
                    ? $gameEntity->getPlayer1Sessid() 
                    : $gameEntity->getPlayer2Sessid();
            }
            $isYourTurn = !empty($gameEntity) ? ($sessidOfTurnPlayer === $session->get("playerId")) : true;

            // Anchoring the color of the first move
            if (is_null($state)) {
                $state = $game->getTurnOfPlayer() === "white" ? "W" : "";
            }

            $pieces = $this->rulesService->getPiecesMatrices();
            foreach ($pieces as $piece) {
                $pieceCount = array_find($game->getAvailablePieces(), function ($availablePiece) use ($game, $piece) {
                    return $availablePiece['color'] === $game->getTurnOfPlayer() 
                        && $availablePiece['piece'] === $piece->getPiece();
                })['count'];
                $piece->setCount($pieceCount);
            }
            $canPlay = $this->canThePlayersPlay($game, $state);

            if (!empty($game->getVictory())) {
                return [$this->render('game.html.twig', [
                    'isYourTurn' => false,
                    'pieces' => $pieces,
                    'canPlay' => $canPlay,
                    'selectedMatrix' => null,
                    'id' => $gameEntity ? $gameEntity->getId() : null,
                    'game' => $game,
                    'selectedPiece' => null,
                    'isDraw' => false,
                ]), $state];
            }
        } catch (ClientExceptionInterface $exception) {
            $response = $exception->getResponse()->toArray(false);
            if (!empty($response["additionalContext"]["move"])) {
                $errorMoveResponse = $response["additionalContext"]["move"];
                if (is_array($errorMoveResponse)) {
                    $errorMove = $this->stateUpdater->stringifyMove(
                        $errorMoveResponse['skipped'],
                        $errorMoveResponse['piece'], 
                        $errorMoveResponse['rotation'], 
                        $errorMoveResponse['mirrored'], 
                        intval($errorMoveResponse['column']) + 1
                    );
                } else {
                    $errorMove = $errorMoveResponse;
                }
                $errorMessage = $response["message"];
                $state = $this->stateUpdater->keepOnlyUntilMove($state, $errorMove);
                return $this->runAndRenderGame($session, $gameEntity, $state, $selected, $selectedMirrored, $selectedRotation, $column, $errorMessage, null);
            } else {
                return [$this->render('error.html.twig', [
                    "errorMessage" => $response["message"]
                ]), $state];
            }
        } catch (ServerExceptionInterface $exception) {
            return [$this->render('error.html.twig', [
                "errorMessage" => "The server appears to be unavailable. Please contact an administrator.",
            ]), $state];
        }

        /** @var Piece $selectedPiece */
        $selectedPiece = array_find($pieces, function ($piece) use ($selected) {
            return $piece->getPiece() === $selected;
        });

        $otherColor = $game->getTurnOfPlayer() === "blue" ? "white" : "blue";

        // We just ignore out of turn plays to avoid refreshes displaying an error message
        if ($isYourTurn) {
            if (!$canPlay[$game->getTurnOfPlayer()] && $canPlay[$otherColor]) {
                $state .= " --";
                $infoMessage = "The turn of {$game->getTurnOfPlayer()} was skipped because there was no legal move to play.";
                return $this->runAndRenderGame($session, $gameEntity, $state, null, null, null, null, null, $infoMessage);
            } else if (!empty($column)) {
                if (!empty($state)) {
                    $state .= " ";
                }
                $state .= $this->stateUpdater->stringifyMove(false, $selected, $selectedRotation, $selectedMirrored, $column);
                return $this->runAndRenderGame($session, $gameEntity, $state, null, null, null, null, null, null);
            }
        }
        if (!$infoMessage && !$isYourTurn) {
            $infoMessage = "Waiting for your opponent to play...";
        }

        return [$this->render('game.html.twig', [
            'id' => $gameEntity ? $gameEntity->getId() : null,
            'state' => $state,
            'game' => $game,
            'isYourTurn' => $isYourTurn && $canPlay[$game->getTurnOfPlayer()],
            'pieces' => $pieces,
            'canPlay' => $canPlay,
            'isDraw' => !$canPlay["blue"] and !$canPlay["white"], 
            'infoMessage' => $infoMessage,
            'errorMessage' => $errorMessage,
            'selectedPiece' => $selectedPiece,
            'selectedCanRotate' => $selectedPiece ? count($selectedPiece->getPossibleMatrices()) > 1 : false,
            'selectedCanMirror' => $selectedPiece ? count($selectedPiece->getPossibleMatrices()[0]->getMirrored()) === 1 : false,
            'selectedMirrored' => !empty($selectedPiece) ? $selectedMirrored : false,
            'selectedRotation' => !empty($selectedPiece) ? $selectedRotation : false,
            'selectedMatrix' => !empty($selectedPiece) ? array_find($selectedPiece->getPossibleMatrices(), function ($matrix) use ($selectedRotation, $selectedMirrored) {
                return in_array($selectedMirrored, $matrix->getMirrored())
                    && in_array($selectedRotation, $matrix->getRotations());
            }) : null,
        ]), $state];
    }

    function canThePlayersPlay(Game $game, ?string $state) {
        $canPlay = ["blue" => true, "white" => true];
        $currentPossibleMoves = $this->rulesService->getPossibleMoves($state);

        if ($game->getLastMove() && $game->getLastMove()->getColor() === "blue") {
            if ($game->getLastMove()->getSkipped()) {
                $canPlay["blue"] = false;
            }
            $canPlay["white"] = count($currentPossibleMoves) > 0;
        } else if ($game->getLastMove() && $game->getLastMove()->getColor() === "white") {
            if ($game->getLastMove()->getSkipped()) {
                $canPlay["white"] = false;
            }
            $canPlay["blue"] = count($currentPossibleMoves) > 0;
        } else if ($state === "W") {
            $canPlay["white"] = $currentPossibleMoves;
            $canPlay["blue"] = true;
        } else {
            $canPlay["blue"] = $currentPossibleMoves;
            $canPlay["white"] = true;
        }

        return $canPlay;
    }

    function formatRotation(?string $rotation) {
        $rotation = intval($rotation);
        $rotation = $rotation % 4;
        if ($rotation < 0) {
            return 4 + $rotation;
        }
        return $rotation;
    }
}