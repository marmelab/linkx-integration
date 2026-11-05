<?php

namespace App\Service;

use App\Entity\Game as GameEntity;
use App\Entity\User;
use App\Enum\GameStatus;
use App\Model\Game;
use App\Model\GameOptions;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpClient\Exception\ClientException;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;

class GamePersister
{

    public function __construct(
        private EntityManagerInterface $em,
        private HubInterface $hub,
        private SerializerInterface $serializer,
        private LoggerInterface $logger,
    ) {}

    public function initGame(?User $currentUser, ?GameOptions $options): GameEntity
    {
        $gameEntity = new GameEntity();
        $gameEntity->setFirstPlayer($currentUser);
        if ($options) {
            $gameEntity->setLocalGame($options->isLocal());
        }
        $this->em->persist($gameEntity);
        $this->em->flush();
        return $gameEntity;
    }

    public function saveGame(?User $currentUser, GameEntity $gameEntity, Game $game)
    {
        // Either we have met an error, or we are a spectator: no save
        if (
            is_null($game) ||
            ($currentUser
                && $currentUser->getId() !== $gameEntity->getFirstPlayer()->getId()
                && $currentUser->getId() !== $gameEntity->getSecondPlayer()->getId())
        ) {
            return;
        }

        $canAnyonePlay = array_any($game->getCanPlay(), function ($value) {
            return $value;
        });


        if (!$canAnyonePlay) {
            $gameEntity->setStatus(GameStatus::BLOCKED);
            // TODO in next PR: get victor from largest area
        } else if (!empty($game->getVictory())) {
            $gameEntity->setStatus(GameStatus::EDGES_LINKED);
            if (!is_null($gameEntity->getSecondPlayer())) {
                $gameEntity->setVictor(
                    $game->getLastMove()->getColor() === "blue"
                        ? $gameEntity->getFirstPlayer()
                        : $gameEntity->getSecondPlayer()
                );
            }
        }

        $gameEntity->setState($game->getState());

        $isCreation = is_null($gameEntity->getId());

        $this->em->persist($gameEntity);
        $this->em->flush();

        try {
            if ($isCreation) {
                $this->hub->publish(new Update(
                    "{$_ENV['SERVER_NAME']}/api/admin/games",
                    $this->serializer->serialize($gameEntity, 'json', ['groups' => 'admin-game-view'])
                ));
            }
            $this->hub->publish(new Update(
                "{$_ENV['SERVER_NAME']}/api/admin/games/{$gameEntity->getId()}",
                $this->serializer->serialize($gameEntity, 'json', ['groups' => 'admin-game-view'])
            ));
        } catch (Exception $exception) {
            $this->logger->error($exception->getMessage() . ($exception->getPrevious() ? " {$exception->getPrevious()->getMessage()}" : ""));
        }
    }
}
