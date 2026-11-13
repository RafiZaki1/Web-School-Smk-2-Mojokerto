<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface BaseRepositoryInterface
{
    /**
     * Kontrak method all.
     *
     * @return Collection
     */
    public function all(): Collection;

    /**
     * Kontrak method findOrFail.
     *
     * @param  int|string  $id
     * @return Model
     */
    public function findOrFail(int|string $id): Model;

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
     * @param  Model  $model
     * @param  array  $data
     * @return Model
     */
    public function update(Model $model, array $data): Model;

    /**
     * Kontrak method delete.
     *
     * @param  Model  $model
     * @return bool
     */
    public function delete(Model $model): bool;

    /**
     * Kontrak method count.
     *
     * @param  array  $where
     * @return int
     */
    public function count(array $where = []): int;

    /**
     * Kontrak method latestUpdated.
     *
     * @param  array<int, string>  $columns
     * @param  int  $limit
     * @return Collection
     */
    public function latestUpdated(int $limit = 5, array $columns = ['*']): Collection;

    /**
     * Kontrak method countPublishSummary.
     *
     * @return array{total: int, drafts: int}
     */
    public function countPublishSummary(): array;
}
