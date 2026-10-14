<?php

namespace App\Service;

use App\Entity\Game;
use App\Entity\Move;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class LinkxRules
{
    public function __construct(
        private HttpClientInterface $client, 
        private Mapper $mapper,
    )
    {
    }

    public function getGameFromStringState(?string $state): Game {
        $queryParams = !empty($state) ? "?state=$state" : "";
        $response = $this->client->request(
            'GET',
            "http://node-linkx:3000/game-state$queryParams"
        );

        $content = json_decode($response->getContent(true))->gameState;
        
        return $this->mapper->json->map($content, Game::class);
    }

    public function getPossibleMoves(?string $state): array {
        $queryParams = !empty($state) ? "?state=$state" : "";
        $response = $this->client->request(
            'GET',
            "http://node-linkx:3000/game-state/possible-moves$queryParams"
        );

        $content = json_decode($response->getContent(true))->possibleMoves;
        
        return $this->mapper->json->mapArray($content, [], Move::class);
    }
}