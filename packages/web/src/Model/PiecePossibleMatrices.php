<?php

namespace App\Model;

use Symfony\Component\Serializer\Attribute\Groups;

class PiecePossibleMatrices
{
    #[Groups(['game-view'])]
    private array $rotations;

    #[Groups(['game-view'])]
    private array $mirrored;

    #[Groups(['game-view'])]
    private array $matrix;

    public function getRotations()
    {
        return $this->rotations;
    }
    public function getMirrored()
    {
        return $this->mirrored;
    }
    public function getMatrix()
    {
        return $this->matrix;
    }
    public function setRotations(array $rotations): self
    {
        $this->rotations = $rotations;
        return $this;
    }
    public function setMirrored(array $mirrored): self
    {
        $this->mirrored = $mirrored;
        return $this;
    }
    public function setMatrix(array $matrix): self
    {
        $this->matrix = $matrix;
        return $this;
    }
}
