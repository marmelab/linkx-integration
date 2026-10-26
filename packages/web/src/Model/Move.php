<?php

namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Attribute\Groups;

class Move
{
    public function __construct(
        #[Groups(['game-view'])]
        #[Assert\NotBlank]
        private bool $skipped,

        #[Groups(['game-view'])]
        #[Assert\NotBlank]
        #[Assert\Regex('/^(blue|white)$/')]
        private string $color,

        #[Assert\Regex('/^(1|2|3L|3I|4S|4L|4T)$/')]
        private ?string $piece,

        #[Assert\All(
            new Assert\GreaterThanOrEqual(0),
            new Assert\LessThanOrEqual(8)
        )]
        private ?int $column,

        #[Assert\All(
            new Assert\GreaterThanOrEqual(0),
            new Assert\LessThanOrEqual(3)
        )]
        private ?int $rotation,

        private ?bool $mirrored,
    ) {}

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
