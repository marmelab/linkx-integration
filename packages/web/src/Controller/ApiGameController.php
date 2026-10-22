<?php

namespace App\Controller;

use App\Entity\Game;
use App\Repository\GameRepository;
use App\Service\GameRunner;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

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

    #[Route('/api/games/{id}', name: 'show_game', methods: ['GET'])]
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
}
