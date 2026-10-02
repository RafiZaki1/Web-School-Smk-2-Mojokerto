<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface AspirationRepositoryInterface extends BaseRepositoryInterface
{
    public function followedUp(int $limit = 10): Collection;

    public function countByStatus(): array;
}
