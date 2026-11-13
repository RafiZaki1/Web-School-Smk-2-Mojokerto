<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface AlumniRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Kontrak method list.
     *
     * @param  bool  $featuredOnly
     * @return Collection
     */
    public function list(bool $featuredOnly = false): Collection;
}
