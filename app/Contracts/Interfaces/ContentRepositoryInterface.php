<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Repository untuk konten publik yang punya slug (jurusan, prestasi, ekstra, berita, lowongan).
 */
interface ContentRepositoryInterface extends BaseRepositoryInterface
{
    public function published(array $filters = []): Collection;

    public function findPublishedOrFail(int|string $identifier): Model;

    public function findByIdentifierOrFail(int|string $identifier): Model;

    public function slugExists(string $slug, int|string|null $ignoreId = null): bool;
}
