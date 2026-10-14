<?php 
namespace App\Controller;

use App\Entity\Game;
use App\Service\LinkxRules as ServiceLinkxRules;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;

class GameController extends AbstractController
{

    #[Route('/game')]
    public function state(ServiceLinkxRules $rulesService, Request $request): Response
    {
        $state = $request->query->get("state");
        try {
            $game = $rulesService->getGameFromStringState($state);
            $canPlay = $this->canThePlayersPlay($game, $rulesService, $state);
        } catch (ClientExceptionInterface $exception) {
            // TODO render last state instead (in a ticket where you can play)
            return $this->render('base.html.twig');
        }

        return $this->render('game.html.twig', [
            'game' => $game,
            'canPlay' => $canPlay,
        ]);
    }

    function canThePlayersPlay(Game $game, ServiceLinkxRules $rulesService, string $state) {
        $canPlay = ["blue" => true, "white" => true];
        $currentPossibleMoves = $rulesService->getPossibleMoves($state);

        if ($game->getLastMove()->getColor() === "blue") {
            if ($game->getLastMove()->getSkipped()) {
                $canPlay["blue"] = false;
            }
            $canPlay["white"] = count($currentPossibleMoves) > 0;
        } else if ($game->getLastMove()->getColor() === "white") {
            if ($game->getLastMove()->getSkipped()) {
                $canPlay["white"] = false;
            }
            $canPlay["blue"] = count($currentPossibleMoves) > 0;
        }

        return $canPlay;
    }
}