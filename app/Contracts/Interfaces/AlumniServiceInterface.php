<?php

namespace App\Contracts\Interfaces;

use App\Models\Alumni;
use Illuminate\Database\Eloquent\Collection;

interface AlumniServiceInterface
{
    /**
     * Kontrak method getList.
     *
     * @param  bool  $featuredOnly
     * @return Collection
     */
    public function getList(bool $featuredOnly = false): Collection;

    /**
     * Kontrak method getById.
     *
     * @param  int|string  $id
     * @return Alumni
     */
    public function getById(int|string $id): Alumni;

    /**
     * Kontrak method create.
     *
     * @param  array  $data
     * @return Alumni
     */
    public function create(array $data): Alumni;

    /**
     * Kontrak method update.
     *
     * @param  int|string  $id
     * @param  array  $data
     * @return Alumni
     */
    public function update(int|string $id, array $data): Alumni;

    /**
     * Kontrak method delete.
     *
     * @param  int|string  $id
     * @return bool
     */
    public function delete(int|string $id): bool;
}
