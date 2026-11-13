<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Layanan CRUD untuk data TU tanpa slug: daftar publik, daftar admin berfilter, dan berkas gambar.
 */
interface RecordServiceInterface
{
    /**
     * Kontrak method getPublished.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection
     */
    public function getPublished(array $filters = []): Collection;

    /**
     * Kontrak method getAll.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection;

    /**
     * Kontrak method find.
     *
     * @param  int|string  $id
     * @return Model
     */
    public function find(int|string $id): Model;

    /**
     * Kontrak method create.
     *
     * @param  array<string, mixed>  $data
     * @return Model
     */
    public function create(array $data): Model;

    /**
     * Kontrak method update.
     *
     * @param  array<string, mixed>  $data
     * @param  int|string  $id
     * @return Model
     */
    public function update(int|string $id, array $data): Model;

    /**
     * Kontrak method delete.
     *
     * @param  int|string  $id
     * @return bool
     */
    public function delete(int|string $id): bool;
}
