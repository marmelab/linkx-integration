<?php

namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

class ListParams
{
    #[Assert\GreaterThanOrEqual(0)]
    private int $_start;

    #[Assert\GreaterThanOrEqual(0)]
    private int $_end;

    private array|string $_sort;

    #[Assert\Regex("/(asc|desc)/i")]
    private string $_order;

    /**
     * Get the value of _sort
     *
     * @return array|string
     */
    public function get_sort(): array|string
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
    public function get_order(): string
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
    public function get_start(): int
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
    public function get_end(): int
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
}
