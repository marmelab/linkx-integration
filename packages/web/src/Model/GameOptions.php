<?php

namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

class GameOptions
{

    #[Assert\NotBlank]
    private bool $local;

    public function isLocal()
    {
        return $this->local;
    }

    public function setLocal(bool $local): static
    {
        $this->local = $local;

        return $this;
    }
}
