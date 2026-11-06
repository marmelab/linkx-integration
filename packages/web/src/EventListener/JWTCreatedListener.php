<?php

namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class JWTCreatedListener
{

    public function __construct() {}

    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        /** @var User */
        $user = $event->getUser();

        $payload       = $event->getData();
        $payload["id"] = $user->getUserIdentifier();
        $payload["fullName"] = $user->getDisplayName();
        $payload["iss"] = $_ENV['JWT_ISSUER'];
        $payload["aud"] = $_ENV['MERCURE_PUBLIC_URL'];

        if (empty($payload["authorization_details"]) && in_array("ROLE_ADMIN", $user->getRoles())) {
            $payload["authorization_details"] = [
                [
                    "type" => "https://mercure.rocks/authorization-detail",
                    "actions" => ["subscribe"],
                    "topics" => [["match" => "*"]],
                ]
            ];
        }

        $event->setData($payload);

        $header = $event->getHeader();
        $header['typ'] = "at+jwt";
        $event->setHeader($header);
    }
}
