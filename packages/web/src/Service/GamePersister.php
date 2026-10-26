<?php

namespace App\Service;

use App\Entity\Game as GameEntity;
use App\Entity\User;
use App\Model\Game;
use App\Model\GameOptions;
use Doctrine\ORM\EntityManagerInterface;

class GamePersister
{

    public function __construct(
        private EntityManagerInterface $em,
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

    public function saveGame(User $currentUser, GameEntity $gameEntity, Game $game)
    {
        // Either we have met an error, or we are a spectator: no save
        if (
            is_null($game) ||
            $currentUser->getId() !== $gameEntity->getFirstPlayer()->getId()
            && $currentUser->getId() !== $gameEntity->getSecondPlayer()->getId()
        ) {
            return;
        }

        $canAnyonePlay = array_any($game->getCanPlay(), function ($value) {
            return $value;
        });

        if (!empty($game->getVictory()) || !$canAnyonePlay) {
            $gameEntity->setCompleted(true);
        }

        $gameEntity->setState($game->getState());

        $this->em->persist($gameEntity);
        $this->em->flush();
    }
}
