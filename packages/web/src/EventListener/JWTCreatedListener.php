<?php

namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedListener
{

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

        $event->setData($payload);

        $header = $event->getHeader();
        $header['typ'] = "at+jwt";
        $event->setHeader($header);
    }
}
