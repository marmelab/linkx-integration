<?php 
namespace App\Controller;

use App\Model\Game;
use App\Service\LinkxRules as ServiceLinkxRules;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;

class GameController extends AbstractController
{

    #[Route('/game')]
    public function state(ServiceLinkxRules $rulesService, Request $request): Response
    {
        $state = $request->query->get("state");
        try {
            $game = $rulesService->getGameFromStringState($state);
            $pieces = $rulesService->getPiecesMatrices();
            foreach ($pieces as $piece) {
                $pieceCount = array_find($game->getAvailablePieces(), function ($availablePiece) use ($piece) {
                    return $availablePiece['piece'] === $piece->getPiece();
                })['count'];
                $piece->setCount($pieceCount);
            }
            $canPlay = $this->canThePlayersPlay($game, $rulesService, $state);
        } catch (ClientExceptionInterface $exception) {
            // TODO render last state instead (in a ticket where you can play)
            $response = $exception->getResponse()->toArray(false);
            if (!empty($response["additionalContext"]["move"])) {
                return $this->render('error.html.twig', [
                    "errorMessage" => $response["message"],
                    "move" => $response["additionalContext"]["move"],
                ]);
            }
            return $this->render('error.html.twig', [
                "errorMessage" => $response["message"],
            ]);
        } catch (ServerExceptionInterface $exception) {
            return $this->render('error.html.twig', [
                "errorMessage" => "The server appears to be unavailable. Please contact an administrator.",
            ]);
        }

        return $this->render('game.html.twig', [
            'game' => $game,
            'pieces' => $pieces,
            'canPlay' => $canPlay,
            'selectedPiece' => $pieces[0], // TODO
        ]);
    }

    function canThePlayersPlay(Game $game, ServiceLinkxRules $rulesService, ?string $state) {
        $canPlay = ["blue" => true, "white" => true];
        $currentPossibleMoves = $rulesService->getPossibleMoves($state);

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
}