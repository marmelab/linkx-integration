<?php

namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

class UserEdit
{

    // Ignored
    private ?int $id = null;

    #[Assert\NotBlank]
    #[Assert\Length(max: 180)]
    private ?string $username = null;

    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    private ?string $displayName = null;

    #[Assert\NotBlank]
    #[Assert\Email]
    private ?string $email = null;

    // Ignored (for now)
    private array $roles = [];

    /**
     * Get the value of username
     *
     * @return ?string
     */
    public function getUsername(): ?string
    {
        return $this->username;
    }

    /**
     * Set the value of username
     *
     * @param ?string $username
     *
     * @return self
     */
    public function setUsername(?string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get the value of displayName
     *
     * @return ?string
     */
    public function getDisplayName(): ?string
    {
        return $this->displayName;
    }

    /**
     * Set the value of displayName
     *
     * @param ?string $displayName
     *
     * @return self
     */
    public function setDisplayName(?string $displayName): self
    {
        $this->displayName = $displayName;

        return $this;
    }

    /**
     * Get the value of email
     *
     * @return ?string
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * Set the value of email
     *
     * @param ?string $email
     *
     * @return self
     */
    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }
}
