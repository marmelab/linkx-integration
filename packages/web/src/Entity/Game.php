<?php

namespace App\Entity;

class Game {
    private array $grid = [];
    private array $availablePieces = [];
    private string $turnOfPlayer = "blue";
    private ?Move $lastMove;
    private ?array $victory = [];

    public function __construct()
    {
    }

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
}