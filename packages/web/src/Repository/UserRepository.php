<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    /**
     * @return User[]
     */
    public function findFilteredBy(array $filter, array $sort, int $limit, int $offset): array
    {
        $qb = $this->getFilteredQueryForList($filter);

        foreach ($sort as $key => $direction) {
            $qb->addOrderBy("u.$key", $direction);
        }
        $qb->setFirstResult($offset);
        $qb->setMaxResults($limit);

        return $qb->getQuery()->getResult();
    }

    /**
     * @return User[]
     */
    public function countFilteredBy(array $filter)
    {
        $qb = $this->getFilteredQueryForList($filter)
            ->select('count(u.id)');


        return $qb->getQuery()->getSingleScalarResult();
    }

    public function findByUniqueUsername(array $value): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('UPPER(u.username) = UPPER(:val)')
            ->setParameter('val', $value['username'])
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findByUniqueEmail(array $value): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('LOWER(u.email) = LOWER(:val)')
            ->setParameter('val', $value['email'])
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    protected function getFilteredQueryForList(array $filter)
    {
        $qb = $this->createQueryBuilder('u');

        if (!empty($filter['q'])) {
            $qb->andWhere($qb->expr()->orX(
                "LOWER(u.displayName) LIKE LOWER(:q)",
                "LOWER(u.username) LIKE LOWER(:q)",
                "LOWER(u.email) LIKE LOWER(:q)"
            ))
                ->setParameter('q', '%' . $filter['q'] . '%');
        }
        if (!empty($filter['id'])) {
            if (is_array($filter['id']) && !empty($filter['id'])) {
                $qb->andWhere($qb->expr()->in('u.id', $filter['id']));
            } else {
                $qb->andWhere('u.id = :id')
                    ->setParameter("id", $filter['id']);
            }
        }

        return $qb;
    }
}
