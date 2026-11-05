<?php

namespace App\Entity;

use App\Enum\GameStatus;
use App\Repository\GameRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: GameRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['list-view', 'admin-game-view'])]
    private ?int $id = null;

    #[ORM\Column(length: 2000, nullable: true)]
    private ?string $state = null;

    #[ORM\ManyToOne(inversedBy: 'gamesAsBlue')]
    #[Groups(['list-view', 'admin-game-view'])]
    private ?User $firstPlayer = null;

    #[ORM\ManyToOne(inversedBy: 'gamesAsWhite')]
    #[Groups(['list-view', 'admin-game-view'])]
    private ?User $secondPlayer = null;

    #[ORM\Column(options: ['default' => false])]
    private ?bool $localGame = false;

    #[Groups(['admin-game-view'])]
    #[ORM\Column(enumType: GameStatus::class)]
    private ?GameStatus $status = GameStatus::RUNNING;

    #[ORM\ManyToOne(inversedBy: 'wonGames')]
    #[Groups(['list-view', 'admin-game-view'])]
    private ?User $victor = null;

    #[ORM\Column]
    #[Groups(['admin-game-view'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['admin-game-view'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\PrePersist]
    public function updateCreatedAt()
    {
        $now = new \DateTimeImmutable('now');
        $this->setCreatedAt($now);
        $this->setUpdatedAt($now);
    }

    #[ORM\PreUpdate]
    public function updateUpdatedAt()
    {
        $this->setUpdatedAt(new \DateTimeImmutable('now'));
    }

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

    #[Groups(['list-view'])]
    public function isCompleted(): ?bool
    {
        return $this->status !== GameStatus::RUNNING;
    }

    public function getFirstPlayer(): ?User
    {
        return $this->firstPlayer;
    }

    public function setFirstPlayer(?User $firstPlayer): static
    {
        $this->firstPlayer = $firstPlayer;

        return $this;
    }

    public function getSecondPlayer(): ?User
    {
        return $this->secondPlayer;
    }

    public function setSecondPlayer(?User $secondPlayer): static
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

    public function getStatus(): ?GameStatus
    {
        return $this->status;
    }

    public function setStatus(GameStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getVictor(): ?User
    {
        return $this->victor;
    }

    public function setVictor(?User $victor): static
    {
        $this->victor = $victor;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
