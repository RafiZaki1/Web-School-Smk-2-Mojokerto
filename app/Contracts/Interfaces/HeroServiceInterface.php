<?php

namespace App\Contracts\Interfaces;

use App\Models\Hero;
use Illuminate\Database\Eloquent\Collection;

interface HeroServiceInterface
{
    /**
     * Kontrak method getAll.
     *
     * @return Collection
     */
    public function getAll(): Collection;

    /**
     * Kontrak method getActiveHeroes.
     *
     * @return Collection
     */
    public function getActiveHeroes(): Collection;

    /**
     * Kontrak method getActiveHero.
     *
     * @return ?Hero
     */
    public function getActiveHero(): ?Hero;

    /**
     * Kontrak method getById.
     *
     * @param  int|string  $id
     * @return Hero
     */
    public function getById(int|string $id): Hero;

    /**
     * Kontrak method create.
     *
     * @param  array  $data
     * @return Hero
     */
    public function create(array $data): Hero;

    /**
     * Kontrak method update.
     *
     * @param  int|string  $id
     * @param  array  $data
     * @return Hero
     */
    public function update(int|string $id, array $data): Hero;

    /**
     * Kontrak method delete.
     *
     * @param  int|string  $id
     * @return bool
     */
    public function delete(int|string $id): bool;
}
