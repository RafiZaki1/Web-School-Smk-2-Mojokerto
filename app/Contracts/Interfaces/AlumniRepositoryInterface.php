<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface AlumniRepositoryInterface extends BaseRepositoryInterface
{
    public function list(bool $featuredOnly = false): Collection;
}
