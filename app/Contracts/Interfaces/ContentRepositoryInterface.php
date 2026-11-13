<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Repository untuk konten publik yang punya slug (jurusan, prestasi, ekstra, berita, lowongan).
 */
interface ContentRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Kontrak method published.
     *
     * @param  array  $filters
     * @return Collection
     */
    public function published(array $filters = []): Collection;

    /**
     * Kontrak method findPublishedOrFail.
     *
     * @param  int|string  $identifier
     * @return Model
     */
    public function findPublishedOrFail(int|string $identifier): Model;

    /**
     * Kontrak method findByIdentifierOrFail.
     *
     * @param  int|string  $identifier
     * @return Model
     */
    public function findByIdentifierOrFail(int|string $identifier): Model;

    /**
     * Kontrak method slugExists.
     *
     * @param  string  $slug
     * @param  int|string|null  $ignoreId
     * @return bool
     */
    public function slugExists(string $slug, int|string|null $ignoreId = null): bool;
}
