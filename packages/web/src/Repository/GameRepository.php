<?php

namespace App\Repository;

use App\Entity\Game;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Game>
 */
class GameRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Game::class);
    }

    /**
     * @return Game[]
     */
    public function findCurrentOnlineGames(): array
    {
        return $this->createQueryBuilder('game')
            ->andWhere('game.completed = false')
            ->andWhere('game.firstPlayer is not null')
            ->andWhere('game.secondPlayer is not null')
            ->getQuery()
            ->getResult();
    }
}
