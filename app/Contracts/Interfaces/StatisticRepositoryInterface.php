<?php

namespace App\Contracts\Interfaces;

interface StatisticRepositoryInterface
{
    /**
     * Kontrak method getCounts.
     *
     * @return array
     */
    public function getCounts(): array;

    /**
     * Kontrak method establishedYear.
     *
     * @return ?int
     */
    public function establishedYear(): ?int;
}
