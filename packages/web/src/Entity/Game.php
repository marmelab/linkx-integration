<?php

namespace App\Entity;

use App\Repository\GameRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GameRepository::class)]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 2000, nullable: true)]
    private ?string $state = null;

    #[ORM\Column(length: 255)]
    private ?string $player_1_sessid = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $player_2_sessid = null;

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

    public function getPlayer1Sessid(): ?string
    {
        return $this->player_1_sessid;
    }

    public function setPlayer1Sessid(string $player_1_sessid): static
    {
        $this->player_1_sessid = $player_1_sessid;

        return $this;
    }

    public function getPlayer2Sessid(): ?string
    {
        return $this->player_2_sessid;
    }

    public function setPlayer2Sessid(?string $player_2_sessid): static
    {
        $this->player_2_sessid = $player_2_sessid;

        return $this;
    }
}
