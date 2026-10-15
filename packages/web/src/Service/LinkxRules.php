<?php

namespace App\Service;

use App\Model\Game;
use App\Model\Move;
use App\Model\Piece;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class LinkxRules
{
    const BASE_URI = "http://node-linkx:3000";

    public function __construct(
        private HttpClientInterface $client, 
        private DenormalizerInterface $serializer,
    )
    {
    }

    public function getGameFromStringState(?string $state): Game {
        $queryParams = !empty($state) ? "?state=$state" : "";
        $response = $this->client->request(
            'GET',
            self::BASE_URI . "/game-state$queryParams"
        );

        return $this->serializer->denormalize($response->toArray()['gameState'], Game::class);
    }

    public function getPossibleMoves(?string $state): array {
        $queryParams = !empty($state) ? "?state=$state" : "";
        $response = $this->client->request(
            'GET',
            self::BASE_URI . "/game-state/possible-moves$queryParams"
        );

        return $this->serializer->denormalize($response->toArray()['possibleMoves'], Move::class . '[]');
    }

    public function getPiecesMatrices(): array {
        $response = $this->client->request(
            'GET',
            self::BASE_URI . "/pieces"
        );

        return $this->serializer->denormalize($response->toArray()['possiblePieces'], Piece::class . '[]');
    }
}