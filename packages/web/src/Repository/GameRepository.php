<?php

namespace App\Repository;

use App\Entity\Game;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Query\Join;
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


    /**
     * @return Game[]
     */
    public function findOnlineGamesBy(array $filter, array $sort, int $limit, int $offset)
    {
        $qb = $this->getFilteredQueryForList($filter);

        foreach ($sort as $key => $direction) {
            if (!str_contains($key, ".")) {
                $qb->addOrderBy("g.$key", $direction);
            } else {
                $qb->addOrderBy($key, $direction);
            }
        }
        $qb->setFirstResult($offset);
        $qb->setMaxResults($limit);

        return $qb->getQuery()->getResult();
    }

    public function countOnlineGamesBy(array $filter)
    {
        $qb = $this->getFilteredQueryForList($filter);

        $qb->select("count(g.id)");

        return $qb->getQuery()->getSingleScalarResult();
    }

    private function getFilteredQueryForList($filter)
    {
        $qb = $this->createQueryBuilder('g')
            ->leftJoin('g.firstPlayer', 'firstPlayer')
            ->leftJoin('g.secondPlayer', 'secondPlayer')
            ->leftJoin('g.victor', 'victor')
            ->andWhere('g.firstPlayer is not null')
            ->andWhere('g.secondPlayer is not null')
            ->andWhere('(g.localGame IS NULL OR NOT g.localGame = TRUE)');

        if (!empty($filter['playerId'])) {
            $qb->andWhere($qb->expr()->orX(
                'g.firstPlayer = :playerId',
                'g.secondPlayer = :playerId',
            ))->setParameter('playerId', $filter['playerId']);
        }

        return $qb;
    }
}
