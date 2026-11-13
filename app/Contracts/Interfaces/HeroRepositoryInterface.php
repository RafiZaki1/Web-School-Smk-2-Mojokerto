<?php

namespace App\Contracts\Interfaces;

use App\Models\Hero;
use Illuminate\Database\Eloquent\Collection;

interface HeroRepositoryInterface
{
    /**
     * Kontrak method all.
     *
     * @return Collection
     */
    public function all(): Collection;

    /**
     * Kontrak method active.
     *
     * @return Collection
     */
    public function active(): Collection;

    /**
     * Kontrak method firstActive.
     *
     * @return ?Hero
     */
    public function firstActive(): ?Hero;

    /**
     * Kontrak method findOrFail.
     *
     * @param  int|string  $id
     * @return Hero
     */
    public function findOrFail(int|string $id): Hero;

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
     * @param  Hero  $hero
     * @param  array  $data
     * @return Hero
     */
    public function update(Hero $hero, array $data): Hero;

    /**
     * Kontrak method delete.
     *
     * @param  Hero  $hero
     * @return bool
     */
    public function delete(Hero $hero): bool;
}
