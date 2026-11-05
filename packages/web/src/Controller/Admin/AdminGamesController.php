<?php

namespace App\Controller\Admin;

use App\Entity\Game;
use App\Model\ListParams;
use App\Repository\GameRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

class AdminGamesController extends AbstractController
{
    public function __construct(
        private GameRepository $gameRepository,
    ) {}

    #[Route(path: "/api/admin/games", name: "admin_list_games")]
    public function adminListGames(#[MapQueryString] ListParams $params)
    {
        $sort = gettype($params->get_sort()) === "string"
            ? [$params->get_sort() => $params->get_order() ?? "ASC"]
            : array_reduce($params->get_sort(), function ($accumulator, $sortElem) use ($params) {
                return $accumulator[$sortElem] = $params->get_order() ?? "ASC";
            }, []);

        $filter = [];
        $filter['playerId'] = $params->getPlayerId();

        $users = $this->gameRepository->findOnlineGamesBy(
            $filter,
            $sort,
            $params->get_end() - $params->get_start(),
            $params->get_start()
        );

        return $this->json($users, 200, [
            "X-Total-Count" => $this->gameRepository->countOnlineGamesBy($filter),
        ], ['groups' => ['admin-game-view']]);
    }

    #[Route(path: "/api/admin/games/{id}", name: "admin_show_game")]
    public function adminShowGame(Game $game)
    {
        return $this->json($game, 200, [], ['groups' => 'admin-game-view']);
    }
}
