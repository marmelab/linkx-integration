<?php

namespace App\Model;

class Move {
    private bool $skipped;
    private string $color;
    private ?string $piece;
    private ?int $column;
    private ?int $rotation;
    private ?bool $mirrored;

    public function getSkipped()
    {
        return $this->skipped;
    }

    public function setSkipped(bool $skipped)
    {
        $this->skipped = $skipped;

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

    public function getPiece()
    {
        return $this->piece;
    }

    public function setPiece(?string $piece)
    {
        $this->piece = $piece;

        return $this;
    }

    public function getColumn()
    {
        return $this->column;
    }

    public function setColumn(?int $column)
    {
        $this->column = $column;

        return $this;
    }

    public function getRotation()
    {
        return $this->rotation;
    }

    public function setRotation(?int $rotation)
    {
        $this->rotation = $rotation;

        return $this;
    }

    public function getMirrored()
    {
        return $this->mirrored;
    }

    public function setMirrored(?bool $mirrored)
    {
        $this->mirrored = $mirrored;

        return $this;
    }
}