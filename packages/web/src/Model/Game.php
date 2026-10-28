<?php

namespace App\Model;

use App\Entity\User;
use Symfony\Component\Serializer\Attribute\Groups;

class Game
{
    #[Groups(['game-view'])]
    private ?int $id;

    #[Groups(['game-view'])]
    private array $grid = [];

    /**@var Piece[] */
    #[Groups(['game-view'])]
    private array $availablePieces = [];

    #[Groups(['game-view'])]
    private string $turnOfPlayer = "blue";

    #[Groups(['game-view'])]
    private ?Move $lastMove = null;

    #[Groups(['game-view'])]
    private ?array $victory = [];

    #[Groups(['game-view'])]
    private ?array $canPlay = ["white" => true, "blue" => true];

    private ?string $state = null;

    #[Groups(['game-view'])]
    private ?User $firstPlayer = null;

    #[Groups(['game-view'])]
    private ?User $secondPlayer = null;

    #[Groups(['game-view'])]
    private ?bool $completed = false;

    #[Groups(['game-view'])]
    private ?bool $local = false;

    public function __construct() {}

    public function getVictory()
    {
        return $this->victory;
    }

    public function setVictory(?array $victory)
    {
        $this->victory = $victory;

        return $this;
    }

    public function getLastMove()
    {
        return $this->lastMove;
    }

    public function setLastMove(?Move $lastMove)
    {
        $this->lastMove = $lastMove;

        return $this;
    }

    public function getTurnOfPlayer()
    {
        return $this->turnOfPlayer;
    }

    public function setTurnOfPlayer(string $turnOfPlayer)
    {
        $this->turnOfPlayer = $turnOfPlayer;

        return $this;
    }

    public function getAvailablePieces()
    {
        return $this->availablePieces;
    }

    /**
     * @param Piece[] $availablePieces
     */
    public function setAvailablePieces(array $availablePieces)
    {
        $this->availablePieces = $availablePieces;

        return $this;
    }

    public function getGrid()
    {
        return $this->grid;
    }

    public function setGrid(array $grid)
    {
        $this->grid = $grid;

        return $this;
    }

    public function getCanPlay()
    {
        return $this->canPlay;
    }

    public function setCanPlay(array $canPlay): self
    {
        $this->canPlay = $canPlay;
        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(?string $state): self
    {
        $this->state = $state;
        return $this;
    }

    public function getFirstPlayer(): ?User
    {
        return $this->firstPlayer;
    }

    public function setFirstPlayer(?User $firstPlayer): self
    {
        $this->firstPlayer = $firstPlayer;
        return $this;
    }

    public function getSecondPlayer(): ?User
    {
        return $this->secondPlayer;
    }

    public function setSecondPlayer(?User $secondPlayer): self
    {
        $this->secondPlayer = $secondPlayer;
        return $this;
    }

    public function isCompleted(): bool
    {
        return $this->completed ?? false;
    }

    public function setCompleted(bool $completed): self
    {
        $this->completed = $completed;
        return $this;
    }

    public function isLocal(): bool
    {
        return $this->local ?? false;
    }

    public function setLocal(bool $local): self
    {
        $this->local = $local;
        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id)
    {
        $this->id = $id;

        return $this;
    }
}
