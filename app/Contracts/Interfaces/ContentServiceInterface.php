<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Layanan konten publik + CRUD admin (jurusan, prestasi, ekstra, berita, lowongan).
 */
interface ContentServiceInterface
{
    /**
     * Kontrak method getPublished.
     *
     * @param  array  $filters
     * @return Collection
     */
    public function getPublished(array $filters = []): Collection;

    /**
     * Kontrak method getPublishedByIdentifier.
     *
     * @param  int|string  $identifier
     * @return Model
     */
    public function getPublishedByIdentifier(int|string $identifier): Model;

    /**
     * Kontrak method getAll.
     *
     * @return Collection
     */
    public function getAll(): Collection;

    /**
     * Kontrak method getByIdentifier.
     *
     * @param  int|string  $identifier
     * @return Model
     */
    public function getByIdentifier(int|string $identifier): Model;

    /**
     * Kontrak method create.
     *
     * @param  array  $data
     * @return Model
     */
    public function create(array $data): Model;

    /**
     * Kontrak method update.
     *
     * @param  int|string  $identifier
     * @param  array  $data
     * @return Model
     */
    public function update(int|string $identifier, array $data): Model;

    /**
     * Kontrak method delete.
     *
     * @param  int|string  $identifier
     * @return bool
     */
    public function delete(int|string $identifier): bool;
}
