<?php

namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

class ListParams
{
    #[Assert\GreaterThanOrEqual(0)]
    private ?int $_start = 0;

    #[Assert\GreaterThanOrEqual(0)]
    private ?int $_end = null;

    private array|string|null $_sort = null;

    #[Assert\Regex("/(asc|desc)/i")]
    private ?string $_order = null;

    /**
     * Represents the full text search. Can be empty.
     */
    private ?string $q = null;

    /**
     * @var ?int[]
     */
    #[Assert\Count(max: 1000)] // Hard limit forced by the use of SQL's IN
    private ?array $id = null;

    private ?int $playerId = null;

    /**
     * Get the value of _sort
     *
     * @return array|string
     */
    public function get_sort(): array|string|null
    {
        return $this->_sort;
    }

    /**
     * Set the value of _sort
     *
     * @param array|string $_sort
     *
     * @return self
     */
    public function set_sort(array|string $_sort): self
    {
        $this->_sort = $_sort;

        return $this;
    }

    /**
     * Get the value of _order
     *
     * @return string
     */
    public function get_order(): ?string
    {
        return $this->_order;
    }

    /**
     * Set the value of _order
     *
     * @param string $_order
     *
     * @return self
     */
    public function set_order(string $_order): self
    {
        $this->_order = $_order;

        return $this;
    }

    /**
     * Get the value of _start
     *
     * @return int
     */
    public function get_start(): ?int
    {
        return $this->_start;
    }

    /**
     * Set the value of _start
     *
     * @param int $_start
     *
     * @return self
     */
    public function set_start(int $_start): self
    {
        $this->_start = $_start;

        return $this;
    }

    /**
     * Get the value of _end
     *
     * @return int
     */
    public function get_end(): ?int
    {
        return $this->_end;
    }

    /**
     * Set the value of _end
     *
     * @param int $_end
     *
     * @return self
     */
    public function set_end(int $_end): self
    {
        $this->_end = $_end;

        return $this;
    }

    /**
     * Get the value of q
     *
     * @return string
     */
    public function getQ(): ?string
    {
        return $this->q;
    }

    /**
     * Set the value of q
     *
     * @param string $q
     *
     * @return self
     */
    public function setQ(?string $q): self
    {
        $this->q = $q;

        return $this;
    }

    /**
     * @return ?int[]
     */
    public function getId(): ?array
    {
        return $this->id;
    }

    /**
     * @param ?int[] $id
     */
    public function setId(?array $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getPlayerId(): ?int
    {
        return $this->playerId;
    }

    public function setPlayerId(?int $playerId): static
    {
        $this->playerId = $playerId;

        return $this;
    }
}
