<?php

namespace App\Contracts\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * CRUD dasar yang dipakai bersama repository konten. Turunan cukup
 * menentukan $model dan (bila perlu) scope urutan/terbit & filter.
 */
abstract class BaseRepository
{
    /** @var class-string<Model> */
    protected string $model;

    protected string $slugColumn = 'slug';

    protected function query(): Builder
    {
        return $this->model::query();
    }

    /** Urutan default daftar; turunan menimpa bila model punya scope ordered(). */
    protected function ordered(Builder $query): Builder
    {
        return method_exists($this->model, 'scopeOrdered') ? $query->ordered() : $query->latest('id');
    }

    /** Batasi ke data yang tampil di web publik. */
    protected function onlyPublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /** Filter tambahan dari query string (kategori, pencarian, dsb). */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query;
    }

    public function all(): Collection
    {
        return $this->ordered($this->query())->get();
    }

    public function published(array $filters = []): Collection
    {
        $query = $this->applyFilters($this->onlyPublished($this->query()), $filters);

        if (! empty($filters['limit'])) {
            $query->limit((int) $filters['limit']);
        }

        return $this->ordered($query)->get();
    }

    public function findOrFail(int|string $id): Model
    {
        return $this->query()->findOrFail($id);
    }

    public function findByIdentifierOrFail(int|string $identifier): Model
    {
        return $this->identifierQuery($this->query(), $identifier)->firstOrFail();
    }

    public function findPublishedOrFail(int|string $identifier): Model
    {
        return $this->identifierQuery($this->onlyPublished($this->query()), $identifier)->firstOrFail();
    }

    public function slugExists(string $slug, int|string|null $ignoreId = null): bool
    {
        return $this->query()
            ->where($this->slugColumn, $slug)
            ->when($ignoreId, fn (Builder $query) => $query->whereKeyNot($ignoreId))
            ->exists();
    }

    public function create(array $data): Model
    {
        return $this->query()->create($data);
    }

    public function update(Model $model, array $data): Model
    {
        $model->update($data);

        return $model->refresh();
    }

    public function delete(Model $model): bool
    {
        return (bool) $model->delete();
    }

    public function count(array $where = []): int
    {
        return $this->query()->where($where)->count();
    }

    public function latestUpdated(int $limit = 5): Collection
    {
        return $this->query()->latest('updated_at')->limit($limit)->get();
    }

    protected function identifierQuery(Builder $query, int|string $identifier): Builder
    {
        return is_numeric($identifier)
            ? $query->whereKey($identifier)
            : $query->where($this->slugColumn, $identifier);
    }
}
