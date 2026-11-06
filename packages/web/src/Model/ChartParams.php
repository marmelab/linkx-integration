<?php

namespace App\Model;

class ChartParams
{

    private \DateTimeImmutable $fromDate;
    private \DateTimeImmutable $toDate;

    /**
     * Get the value of fromDate
     *
     * @return \DateTimeImmutable
     */
    public function getFromDate(): \DateTimeImmutable
    {
        return $this->fromDate;
    }

    /**
     * Set the value of fromDate
     *
     * @param \DateTimeImmutable $fromDate
     *
     * @return self
     */
    public function setFromDate(\DateTimeImmutable $fromDate): self
    {
        $this->fromDate = $fromDate;

        return $this;
    }

    /**
     * Get the value of toDate
     *
     * @return \DateTimeImmutable
     */
    public function getToDate(): \DateTimeImmutable
    {
        return $this->toDate;
    }

    /**
     * Set the value of toDate
     *
     * @param \DateTimeImmutable $toDate
     *
     * @return self
     */
    public function setToDate(\DateTimeImmutable $toDate): self
    {
        $this->toDate = $toDate;

        return $this;
    }
}
