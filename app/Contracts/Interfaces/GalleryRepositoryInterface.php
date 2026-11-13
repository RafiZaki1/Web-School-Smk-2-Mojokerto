<?php

namespace App\Contracts\Interfaces;

use App\Models\Gallery;
use Illuminate\Database\Eloquent\Collection;

interface GalleryRepositoryInterface
{
    /**
     * Kontrak method all.
     *
     * @param  ?string  $category
     * @return Collection
     */
    public function all(?string $category = null): Collection;

    /**
     * Kontrak method active.
     *
     * @param  ?string  $category
     * @return Collection
     */
    public function active(?string $category = null): Collection;

    /**
     * Kontrak method findOrFail.
     *
     * @param  int|string  $id
     * @return Gallery
     */
    public function findOrFail(int|string $id): Gallery;

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
     * @param  Gallery  $gallery
     * @param  array  $data
     * @return Gallery
     */
    public function update(Gallery $gallery, array $data): Gallery;

    /**
     * Kontrak method delete.
     *
     * @param  Gallery  $gallery
     * @return bool
     */
    public function delete(Gallery $gallery): bool;
}
