<?php

namespace App\Model;

use App\Entity\User;

class PublicUser
{

    private readonly string $displayName;

    public function __construct(User $user)
    {
        $this->displayName = $user->getDisplayName();
    }

    public function getDisplayName()
    {
        return $this->displayName;
    }
}
