<?php

namespace App\Model;

use Symfony\Component\Serializer\Attribute\Groups;

class Piece
{

    #[Groups(['game-view'])]
    private string $piece;

    /** @var PiecePossibleMatrices[] */
    private array $possibleMatrices;

    #[Groups(['game-view'])]
    private string $color;

    #[Groups(['game-view'])]
    private int $count = 2;

    public function getPiece()
    {
        return $this->piece;
    }
    public function getPossibleMatrices()
    {
        return $this->possibleMatrices;
    }
    public function getCount()
    {
        return $this->count;
    }
    public function setPiece(string $piece): self
    {
        $this->piece = $piece;
        return $this;
    }
    public function setPossibleMatrices(array $possibleMatrices): self
    {
        $this->possibleMatrices = $possibleMatrices;
        return $this;
    }
    public function setCount(?int $count): self
    {
        $this->count = $count;
        return $this;
    }

    public function getColor()
    {
        return $this->color;
    }

    public function setColor(string $color)
    {
        $this->color = $color;

        return $this;
    }
}
