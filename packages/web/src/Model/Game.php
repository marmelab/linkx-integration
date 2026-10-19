<?php

namespace App\Model;

class Game
{
    private array $grid = [];
    /**@var Piece[] */
    private array $availablePieces = [];
    private string $turnOfPlayer = "blue";
    private ?Move $lastMove = null;
    private ?array $victory = [];
    private ?array $canPlay = ["white" => true, "blue" => true];
    private ?string $state = null;

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
}
