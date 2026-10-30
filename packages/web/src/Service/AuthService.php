<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Exception\ValidationFailedException;

class AuthService
{

    public function __construct(
        private ValidatorInterface $validator,
        private UserPasswordHasherInterface $passwordHasher,
        private EntityManagerInterface $em,
    ) {}

    /**
     * @throws ValidationFailedException
     */
    public function registerUser(string $email, string $username, string $password, ?string $displayName): User
    {
        $user = new User();

        $user->setUsername($username);
        $user->setDisplayName(!empty($displayName) ? $displayName : $username);
        $user->setPassword($password);
        $constraints = $this->validator->validate($user);
        if (count($constraints) > 0) {
            throw new ValidationFailedException("Validation failed.", $constraints);
        }

        $hashedPassword = $this->passwordHasher->hashPassword($user, $user->getPassword());
        $user->setPassword($hashedPassword);

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }
}
