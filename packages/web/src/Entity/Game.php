<?php

namespace App\Entity;

use App\Repository\GameRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GameRepository::class)]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 2000, nullable: true)]
    private ?string $state = null;

    #[ORM\Column]
    private ?bool $hasEnded = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(?string $state): static
    {
        $this->state = $state;

        return $this;
    }

    public function hasEnded(): ?bool
    {
        return $this->hasEnded;
    }

    public function setHasEnded(bool $hasEnded): static
    {
        $this->hasEnded = $hasEnded;

        return $this;
    }
}
