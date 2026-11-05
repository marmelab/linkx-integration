<?php

namespace App\Security;

use App\Entity\User;
use DateTimeImmutable;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Mercure\Jwt\TokenProviderInterface;

final class AccessTokenProvider implements TokenProviderInterface
{
    private User $dummyUser;
    private string $jwt;
    private \DateTimeImmutable $exp;

    public function __construct(
        private JWTTokenManagerInterface $JWTManager
    ) {
        $this->dummyUser = (new User())
            ->setEmail("maxime@marmelab.com");
        $this->exp = new DateTimeImmutable('now');
    }

    public function getJwt(): string
    {
        if ($this->exp <= new DateTimeImmutable('now')) {
            $this->jwt = $this->JWTManager->createFromPayload($this->dummyUser, [
                "iss" => $_ENV['JWT_ISSUER'],
                "sub" => "0",
                "aud" => $_ENV['MERCURE_PUBLIC_URL'],
                "authorization_details" => [
                    [
                        "type" => "https://mercure.rocks/authorization-detail",
                        "actions" => ["publish"],
                        "topics" => [["match" => "*"]],
                    ]
                ]
            ]);
        }

        return $this->jwt;
    }
}
