<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\AlumniRepositoryInterface;
use App\Models\Alumni;
use Illuminate\Database\Eloquent\Collection;

class AlumniRepository extends BaseRepository implements AlumniRepositoryInterface
{
    protected string $model = Alumni::class;

    public function list(bool $featuredOnly = false): Collection
    {
        return $this->query()
            ->when($featuredOnly, fn ($query) => $query->featured())
            ->ordered()
            ->get();
    }
}
