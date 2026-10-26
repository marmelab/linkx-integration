<?php

namespace App\Controller;

use App\Entity\Game;
use App\Entity\User;
use App\Model\Move;
use App\Repository\GameRepository;
use App\Service\GamePersister;
use App\Service\GameRunner;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;

class ApiGameController extends AbstractController
{


    #[Route('/api/games', name: 'api_list_games')]
    public function listGames(GameRepository $gameRepository): JsonResponse
    {
        return $this->json(
            ['games' => $gameRepository->findCurrentOnlineGames()],
            Response::HTTP_OK,
            [],
            ['groups' => 'list-view']
        );
    }

    #[Route('/api/games/{id}', name: 'api_show_game', methods: ['GET'])]
    public function showGame(Game $gameEntity, GameRepository $gameRepository, GameRunner $gameRunner): JsonResponse
    {
        $game = $gameRunner->getGame($gameEntity->getState());
        $game->setCompleted($gameEntity->isCompleted());
        $game->setFirstPlayer($gameEntity->getFirstPlayer());
        $game->setSecondPlayer($gameEntity->getSecondPlayer());
        $game->setGrid(array_map(function ($column) {
            return array_map(function ($cell) {
                switch ($cell) {
                    case "w":
                        return "white";
                    case "b":
                        return "blue";
                    case "W":
                        return "whiteLastMove";
                    case "B":
                        return "blueLastMove";
                    case ".":
                        return ".";
                }
            }, $column);
        }, $game->getGrid()));
        return $this->json(['game' => $game], Response::HTTP_OK, [], ['groups' => 'game-view']);
    }

    #[Route('/api/games/{id}/play-turn', name: 'api_play_turn', methods: ['PATCH'])]
    public function playTurn(
        #[CurrentUser] User $player,
        Game $gameEntity,
        GameRunner $gameRunner,
        GamePersister $gamePersister,
        #[MapRequestPayload] Move $move,
    ) {
        if (
            !$gameEntity->isLocalGame()
            && $gameEntity->getFirstPlayer()->getId() !== $player->getId()
            && $gameEntity->getSecondPlayer()->getId() !== $player->getId()
        ) {
            return $this->json(['message' => 'You cannot play a turn as a spectator.'], Response::HTTP_FORBIDDEN);
        }

        $game = $gameRunner->getGame($gameEntity->getState());

        if (!$gameEntity->isLocalGame()) {
            $currentPlayer = $game->getTurnOfPlayer() === "blue"
                ? $gameEntity->getFirstPlayer()
                : $gameEntity->getSecondPlayer();
            if ($currentPlayer->getId() !== $player->getId()) {
                return $this->json(['message' => 'This is not your turn to play.'], Response::HTTP_FORBIDDEN);
            }
        }

        try {
            $updatedGame = $gameRunner->playTurn(
                $game,
                $move->getPiece(),
                $move->getRotation(),
                $move->getMirrored(),
                $move->getColumn()
            );

            $gamePersister->saveGame($player, $gameEntity, $updatedGame);

            return new Response('', Response::HTTP_CREATED);
        } catch (ClientExceptionInterface $exception) {
            $errorMessage = $exception->getResponse()->toArray(false)['message'];
            $this->json(['message' => $errorMessage], Response::HTTP_BAD_REQUEST);
        } catch (ServerExceptionInterface $exception) {
            $errorMessage = "The server appears to be unavailable. Please contact an administrator.";
            $this->json(['message' => $errorMessage], Response::HTTP_BAD_GATEWAY);
        }
    }
}
