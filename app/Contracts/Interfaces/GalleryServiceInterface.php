<?php

namespace App\Contracts\Interfaces;

use App\Models\Gallery;
use Illuminate\Database\Eloquent\Collection;

interface GalleryServiceInterface
{
    /**
     * Kontrak method getAll.
     *
     * @param  ?string  $category
     * @return Collection
     */
    public function getAll(?string $category = null): Collection;

    /**
     * Kontrak method getActiveGalleries.
     *
     * @param  ?string  $category
     * @return Collection
     */
    public function getActiveGalleries(?string $category = null): Collection;

    /**
     * Kontrak method getById.
     *
     * @param  int|string  $id
     * @return Gallery
     */
    public function getById(int|string $id): Gallery;

    /**
     * Kontrak method create.
     *
     * @param  array  $data
     * @return Gallery
     */
    public function create(array $data): Gallery;

    /**
     * Kontrak method update.
     *
     * @param  int|string  $id
     * @param  array  $data
     * @return Gallery
     */
    public function update(int|string $id, array $data): Gallery;

    /**
     * Kontrak method delete.
     *
     * @param  int|string  $id
     * @return bool
     */
    public function delete(int|string $id): bool;
}
