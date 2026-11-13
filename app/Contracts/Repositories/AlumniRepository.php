<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\AlumniRepositoryInterface;
use App\Models\Alumni;
use Illuminate\Database\Eloquent\Collection;

class AlumniRepository extends BaseRepository implements AlumniRepositoryInterface
{
    /** @var class-string<Alumni> */
    protected string $model = Alumni::class;

    /**
     * Ambil daftar alumni, opsional hanya yang ditandai unggulan.
     */
    public function list(bool $featuredOnly = false): Collection
    {
        return $this->query()
            ->when($featuredOnly, fn ($query) => $query->featured())
            ->ordered()
            ->get();
    }
}
