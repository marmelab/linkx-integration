<?php

namespace App\Entity;

use App\Repository\GameRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: GameRepository::class)]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['list-view'])]
    private ?int $id = null;

    #[ORM\Column(length: 2000, nullable: true)]
    private ?string $state = null;

    #[ORM\Column(options: ['default' => false])]
    #[Groups(['list-view'])]
    private ?bool $completed = false;

    #[ORM\ManyToOne(targetEntity: 'User')]
    #[Groups(['list-view'])]
    private ?User $firstPlayer = null;

    #[ORM\ManyToOne(targetEntity: 'User')]
    #[Groups(['list-view'])]
    private ?User $secondPlayer = null;

    #[ORM\Column(options: ['default' => false])]
    private ?bool $localGame = false;

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

    public function isCompleted(): ?bool
    {
        return $this->completed;
    }

    public function setCompleted(bool $completed): static
    {
        $this->completed = $completed;

        return $this;
    }

    public function getFirstPlayer(): ?User
    {
        return $this->firstPlayer;
    }

    public function setFirstPlayer(User $firstPlayer): static
    {
        $this->firstPlayer = $firstPlayer;

        return $this;
    }

    public function getSecondPlayer(): ?User
    {
        return $this->secondPlayer;
    }

    public function setSecondPlayer(User $secondPlayer): static
    {
        $this->secondPlayer = $secondPlayer;

        return $this;
    }

    public function isLocalGame(): ?bool
    {
        return $this->localGame;
    }

    public function setLocalGame(bool $localGame): static
    {
        $this->localGame = $localGame;

        return $this;
    }
}
