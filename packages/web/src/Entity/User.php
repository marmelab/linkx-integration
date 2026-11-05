<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(fields: 'email', repositoryMethod: 'findByUniqueEmail', message: 'This email is already taken.')]
#[ORM\HasLifecycleCallbacks]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['admin-view', 'admin-game-view'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    #[Groups(['self', 'admin-view'])]
    private ?string $username = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Groups(['admin-view'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Assert\Length(min: 10)]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['self', 'list-view', 'game-view', 'admin-view', 'admin-game-view'])]
    private ?string $displayName = null;

    #[ORM\Column(length: 254)]
    #[Groups(['admin-view'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['admin-view'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['admin-view'])]
    private ?\DateTimeImmutable $updatedAt = null;


    /**
     * Only present for the cascade
     * @var Collection<int, Game>
     */
    #[ORM\OneToMany(targetEntity: Game::class, mappedBy: 'firstPlayer', cascade: ['remove'])]
    private Collection $gamesAsBlue;


    /**
     * Only present for the cascade
     * @var Collection<int, Game>
     */
    #[ORM\OneToMany(targetEntity: Game::class, mappedBy: 'secondPlayer', cascade: ['remove'])]
    private Collection $gamesAsWhite;

    /**
     * @var Collection<int, Game>
     */
    #[ORM\OneToMany(targetEntity: Game::class, mappedBy: 'victor', cascade: ['remove'])]
    private Collection $wonGames;

    public function __construct()
    {
        $this->wonGames = new ArrayCollection();
        $this->gamesAsBlue = new ArrayCollection();
        $this->gamesAsWhite = new ArrayCollection();
    }

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

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        if (empty($roles)) {
            $roles[] = 'ROLE_USER';
        }

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Ensure the session doesn't contain actual password hashes by CRC32C-hashing them, as supported since Symfony 7.3.
     */
    public function __serialize(): array
    {
        $data = (array) $this;
        $data["\0" . self::class . "\0password"] = hash('crc32c', $this->password);

        return $data;
    }

    public function getDisplayName(): ?string
    {
        return $this->displayName;
    }

    public function setDisplayName(string $displayName): static
    {
        $this->displayName = $displayName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

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

    /**
     * @return Collection<int, Game>
     */
    public function getWonGames(): Collection
    {
        return $this->wonGames;
    }

    public function addWonGame(Game $wonGame): static
    {
        if (!$this->wonGames->contains($wonGame)) {
            $this->wonGames->add($wonGame);
            $wonGame->setVictor($this);
        }

        return $this;
    }

    public function removeWonGame(Game $wonGame): static
    {
        if ($this->wonGames->removeElement($wonGame)) {
            // set the owning side to null (unless already changed)
            if ($wonGame->getVictor() === $this) {
                $wonGame->setVictor(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Game>
     */
    public function getGamesAsBlue(): Collection
    {
        return $this->gamesAsBlue;
    }

    public function addGamesAsBlue(Game $gamesAsBlue): static
    {
        if (!$this->gamesAsBlue->contains($gamesAsBlue)) {
            $this->gamesAsBlue->add($gamesAsBlue);
            $gamesAsBlue->setFirstPlayer($this);
        }

        return $this;
    }

    public function removeGamesAsBlue(Game $gamesAsBlue): static
    {
        if ($this->gamesAsBlue->removeElement($gamesAsBlue)) {
            // set the owning side to null (unless already changed)
            if ($gamesAsBlue->getFirstPlayer() === $this) {
                $gamesAsBlue->setFirstPlayer(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Game>
     */
    public function getGamesAsWhite(): Collection
    {
        return $this->gamesAsWhite;
    }

    public function addGamesAsWhite(Game $gamesAsWhite): static
    {
        if (!$this->gamesAsWhite->contains($gamesAsWhite)) {
            $this->gamesAsWhite->add($gamesAsWhite);
            $gamesAsWhite->setSecondPlayer($this);
        }

        return $this;
    }

    public function removeGamesAsWhite(Game $gamesAsWhite): static
    {
        if ($this->gamesAsWhite->removeElement($gamesAsWhite)) {
            // set the owning side to null (unless already changed)
            if ($gamesAsWhite->getSecondPlayer() === $this) {
                $gamesAsWhite->setSecondPlayer(null);
            }
        }

        return $this;
    }
}
