<?php

namespace App\Controller;

use App\Model\Game;
use App\Entity\Game as GameEntity;
use App\Entity\User;
use App\Model\Move;
use App\Model\Piece;
use App\Service\GamePersister;
use App\Service\GameRunner;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;

class GameController extends AbstractController
{

    public function __construct(
        private GameRunner $gameRunner,
        private GamePersister $gamePersister,
    ) {}


    #[Route(path: '/', name: 'app_home')]
    public function home(): Response
    {
        return $this->render("landing.html.twig");
    }

    #[Route('/game')]
    public function state(Request $request, #[CurrentUser] User $user): Response
    {
        $state = $request->query->get("state");
        $selected = $request->query->get("selected");
        $selectedMirrored = $request->query->get("mirror-piece") ?? false;
        $selectedRotation = $this->formatRotation($request->query->get("rotate-piece"));
        $column = $request->query->get("column");

        [$render] = $this->runAndRenderGame($user, null, $state, $selected, $selectedMirrored, $selectedRotation, $column, null, null);

        return $render;
    }

    #[Route('/online-game', methods: ['POST'])]
    public function createOnlineGame(Request $request, #[CurrentUser] User $user): Response
    {
        $csrfToken = $request->getPayload()->get('csrf-token');
        if (!$this->isCsrfTokenValid('create-game', $csrfToken)) {
            return $this->render('error.html.twig', [
                'errorMessage' => "Invalid CSRF token provided.",
            ]);
        }

        $gameEntity = $this->gamePersister->initGame($user, null);

        return $this->redirect("/online-game/{$gameEntity->getId()}");
    }

    #[Route('/online-game/{id}', methods: ['GET', 'POST'])]
    public function onlineGame(Request $request, #[CurrentUser] User $user, GameEntity $gameEntity): Response
    {
        if (
            is_null($gameEntity->getSecondPlayer())
            && $gameEntity->getFirstPlayer()->getId() !== $user->getId()
        ) {
            if (!empty($request->getPayload()->get('join'))) {
                $csrfToken = $request->getPayload()->get('csrf-token');
                if (!$this->isCsrfTokenValid('join-game', $csrfToken)) {
                    return $this->render('error.html.twig', [
                        'errorMessage' => "Invalid CSRF token provided.",
                    ]);
                }
                $gameEntity->setSecondPlayer($user);
            } else {
                return $this->render('join-game.html.twig', [
                    'id' => $gameEntity->getId(),
                ]);
            }
        } else if (
            $gameEntity->getFirstPlayer()->getId() !== $user->getId()
            && $gameEntity->getSecondPlayer()?->getId() !== $user->getId()
        ) {
            $infoMessage = "You are a spectator of this game.";
        }

        $selected = $request->query->get("selected");
        $selectedMirrored = $request->query->get("mirror-piece") ?? false;
        $selectedRotation = $this->formatRotation($request->query->get("rotate-piece"));
        $column = $request->query->get("column");

        [$render, $game] = $this->runAndRenderGame(
            $user,
            $gameEntity,
            $gameEntity->getState(),
            $selected,
            $selectedMirrored,
            $selectedRotation,
            $column,
            null,
            $infoMessage ?? null,
        );

        $this->gamePersister->saveGame($user, $gameEntity, $game);

        return $render;
    }

    private function runAndRenderGame(
        User $user,
        ?GameEntity $gameEntity,
        ?string $state,
        ?string $selected,
        ?bool $selectedMirrored,
        ?int $selectedRotation,
        ?string $column,
        ?string $errorMessage,
        ?string $infoMessage
    ) {
        try {
            $game = $this->gameRunner->getGame($state);

            $isYourTurn = $this->isYourTurn($gameEntity, $game, $user);

            // We just ignore out of turn plays to avoid refreshes displaying an error message
            if ($isYourTurn && !$errorMessage) {
                $game = $this->gameRunner->playTurn($game, $selected, $selectedRotation, $selectedMirrored, $column - 1);
                if ($game->getLastMove() && $game->getLastMove()->getSkipped()) {
                    $infoMessage = "The turn of {$game->getLastMove()->getColor()} was skipped because there was no legal move to play.";
                }
                if (!is_null($column)) {
                    // If a turn was played, change the turn
                    $isYourTurn = $this->isYourTurn($gameEntity, $game, $user);
                    $selected = null;
                    $selectedRotation = null;
                    $selectedMirrored = null;
                    $column = null;
                }
            }

            $piecesOfCurrentPlayer = array_filter($game->getAvailablePieces(), function ($piece) use ($game) {
                return $game->getTurnOfPlayer() === $piece->getColor();
            });

            if (!empty($game->getVictory())) {
                return [$this->render('game.html.twig', [
                    'isYourTurn' => false,
                    'pieces' => $piecesOfCurrentPlayer,
                    'canPlay' => $game->getCanPlay(),
                    'selectedMatrix' => null,
                    'id' => $gameEntity ? $gameEntity->getId() : null,
                    'game' => $game,
                    'selectedPiece' => null,
                    'isDraw' => false,
                ]), $game];
            }

            if (!$infoMessage && !$isYourTurn) {
                $infoMessage = "Waiting for your opponent to play...";
            }

            /** @var Piece $selectedPiece */
            $selectedPiece = array_find($game->getAvailablePieces(), function ($piece) use ($selected) {
                return $piece->getPiece() === $selected;
            });

            return [$this->render('game.html.twig', [
                'id' => $gameEntity ? $gameEntity->getId() : null,
                'state' => $game->getState(),
                'game' => $game,
                'isYourTurn' => $isYourTurn && $game->getCanPlay()[$game->getTurnOfPlayer()],
                'pieces' => $piecesOfCurrentPlayer,
                'canPlay' => $game->getCanPlay(),
                'isDraw' => !$game->getCanPlay()["blue"] && !$game->getCanPlay()["white"],
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
            ]), $game];
        } catch (ClientExceptionInterface $exception) {
            $response = $exception->getResponse()->toArray(false);
            if (!empty($response["additionalContext"]["move"])) {
                $errorMoveResponse = $response["additionalContext"]["move"];
                if (is_array($errorMoveResponse)) {
                    $errorMove = new Move(
                        $errorMoveResponse['skipped'],
                        "ignored",
                        $errorMoveResponse['piece'],
                        $errorMoveResponse['rotation'],
                        $errorMoveResponse['mirrored'],
                        intval($errorMoveResponse['column']) + 1
                    );
                } else {
                    $errorMove = $errorMoveResponse;
                }
                $errorMessage = $response["message"];
                $game = $this->gameRunner->undoTurn($game, $errorMove);
                return [$this->runAndRenderGame($user, $gameEntity, $state, $selected, $selectedMirrored, $selectedRotation, $column, $errorMessage, null), $game];
            } else {
                return [$this->render('error.html.twig', [
                    "errorMessage" => $response["message"]
                ]), null];
            }
        } catch (ServerExceptionInterface $exception) {
            return [$this->render('error.html.twig', [
                "errorMessage" => "The server appears to be unavailable. Please contact an administrator.",
            ]), null];
        }
    }


    function formatRotation(?string $rotation)
    {
        $rotation = intval($rotation);
        $rotation = $rotation % 4;
        if ($rotation < 0) {
            return 4 + $rotation;
        }
        return $rotation;
    }

    function isYourTurn(?GameEntity $gameEntity, Game $game, User $user)
    {
        if (!empty($gameEntity)) {
            $playerIdCurrentTurn = $game->getTurnOfPlayer() === "blue"
                ? $gameEntity->getFirstPlayer()->getId()
                : $gameEntity->getSecondPlayer()?->getId();
        }
        return !empty($gameEntity) ? ($playerIdCurrentTurn === $user->getId()) : true;
    }
}
