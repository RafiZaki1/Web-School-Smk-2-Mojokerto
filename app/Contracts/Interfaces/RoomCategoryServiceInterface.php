<?php

namespace App\Contracts\Interfaces;

use App\Models\RoomCategory;
use Illuminate\Database\Eloquent\Collection;

interface RoomCategoryServiceInterface
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
     * Kontrak method getById.
     *
     * @param  int|string  $identifier
     * @return RoomCategory
     */
    public function getById(int|string $identifier): RoomCategory;

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
     * @param  int|string  $identifier
     * @param  array  $data
     * @return RoomCategory
     */
    public function update(int|string $identifier, array $data): RoomCategory;

    /**
     * Kontrak method delete.
     *
     * @param  int|string  $identifier
     * @return bool
     */
    public function delete(int|string $identifier): bool;
}
