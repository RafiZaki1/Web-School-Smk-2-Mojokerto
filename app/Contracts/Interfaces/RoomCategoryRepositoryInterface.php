<?php

namespace App\Contracts\Interfaces;

use App\Models\RoomCategory;
use Illuminate\Database\Eloquent\Collection;

interface RoomCategoryRepositoryInterface
{
    /**
     * Kontrak method getAll.
     *
     * @return Collection
     */
    public function getAll(): Collection;

    /**
     * Kontrak method getActive.
     *
     * @return Collection
     */
    public function getActive(): Collection;

    /**
     * Kontrak method findByIdentifierOrFail.
     *
     * @param  int|string  $identifier
     * @return RoomCategory
     */
    public function findByIdentifierOrFail(int|string $identifier): RoomCategory;

    /**
     * Kontrak method slugExists.
     *
     * @param  string  $slug
     * @param  int|string|null  $ignoreId
     * @return bool
     */
    public function slugExists(string $slug, int|string|null $ignoreId = null): bool;

    /**
     * Kontrak method create.
     *
     * @param  array  $data
     * @return RoomCategory
     */
    public function create(array $data): RoomCategory;

    /**
     * Kontrak method update.
     *
     * @param  RoomCategory  $category
     * @param  array  $data
     * @return RoomCategory
     */
    public function update(RoomCategory $category, array $data): RoomCategory;

    /**
     * Kontrak method delete.
     *
     * @param  RoomCategory  $category
     * @return bool
     */
    public function delete(RoomCategory $category): bool;
}
