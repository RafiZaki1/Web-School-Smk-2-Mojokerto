<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;

/**
 * Repository untuk data tanpa slug yang dikelola TU (mitra, tata tertib, buku tamu, dan sejenisnya).
 */
interface RecordRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Kontrak method published.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection
     */
    public function published(array $filters = []): Collection;

    /**
     * Kontrak method filtered.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection
     */
    public function filtered(array $filters = []): Collection;
}
