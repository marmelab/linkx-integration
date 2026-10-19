<?php

namespace App\Model;

class PiecePossibleMatrices {
    private array $rotations;
    private array $mirrored;
    private array $matrix;

    public function getRotations() {
        return $this->rotations;
    }
    public function getMirrored() {
        return $this->mirrored;
    }
    public function getMatrix() {
        return $this->matrix;
    }
    public function setRotations(array $rotations): self {
        $this->rotations = $rotations;
        return $this;
    }
    public function setMirrored(array $mirrored): self {
        $this->mirrored = $mirrored;
        return $this;
    }
    public function setMatrix(array $matrix): self {
        $this->matrix = $matrix;
        return $this;
    }
}