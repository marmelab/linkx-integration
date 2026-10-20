<?php

namespace App\Security;

use App\Repository\UserRepository;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class AccessTokenHandler implements AccessTokenHandlerInterface
{
    public function __construct(
        private UserRepository $userRepository,
    ) {}

    public function getUserBadgeFrom(string $accessToken): UserBadge
    {
        if (empty($accessToken)) {
            throw new BadCredentialsException('Empty token provided.');
        }
        $user = $this->userRepository->findOneBy(['currentToken' => $accessToken]);
        if (is_null($user)) {
            throw new BadCredentialsException('Invalid token provided.');
        }

        return new UserBadge($user->getUsername());
    }
}
