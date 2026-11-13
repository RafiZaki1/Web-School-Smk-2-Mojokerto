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

    /**
     * Ambil query builder dasar untuk model repository ini.
     */
    protected function query(): Builder
    {
        return $this->model::query();
    }

    /**
     * Terapkan urutan default daftar. Turunan menimpa bila model punya scope ordered().
     */
    protected function ordered(Builder $query): Builder
    {
        return method_exists($this->model, 'scopeOrdered') ? $query->ordered() : $query->latest('id');
    }

    /**
     * Batasi query ke data yang tampil di web publik.
     */
    protected function onlyPublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * Terapkan filter tambahan dari query string, seperti kategori atau pencarian.
     *
     * @param  array<string, mixed>  $filters
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query;
    }

    /**
     * Ambil seluruh data dengan urutan default.
     */
    public function all(): Collection
    {
        return $this->ordered($this->query())->get();
    }

    /**
     * Ambil data yang diterbitkan beserta filter dan batas jumlah bila diminta.
     *
     * @param  array<string, mixed>  $filters
     */
    public function published(array $filters = []): Collection
    {
        $query = $this->applyFilters($this->onlyPublished($this->query()), $filters);

        if (! empty($filters['limit'])) {
            $query->limit((int) $filters['limit']);
        }

        return $this->ordered($query)->get();
    }

    /**
     * Ambil seluruh data yang cocok dengan filter admin, dengan urutan default.
     *
     * @param  array<string, mixed>  $filters
     */
    public function filtered(array $filters = []): Collection
    {
        return $this->ordered($this->applyFilters($this->query(), $filters))->get();
    }

    /**
     * Cari data berdasarkan id, atau gagal dengan ModelNotFoundException.
     */
    public function findOrFail(int|string $id): Model
    {
        return $this->query()->findOrFail($id);
    }

    /**
     * Cari data berdasarkan id atau slug, atau gagal dengan ModelNotFoundException.
     */
    public function findByIdentifierOrFail(int|string $identifier): Model
    {
        return $this->identifierQuery($this->query(), $identifier)->firstOrFail();
    }

    /**
     * Cari data yang diterbitkan berdasarkan id atau slug, atau gagal.
     */
    public function findPublishedOrFail(int|string $identifier): Model
    {
        return $this->identifierQuery($this->onlyPublished($this->query()), $identifier)->firstOrFail();
    }

    /**
     * Periksa apakah slug sudah dipakai oleh data lain.
     */
    public function slugExists(string $slug, int|string|null $ignoreId = null): bool
    {
        return $this->query()
            ->where($this->slugColumn, $slug)
            ->when($ignoreId, fn (Builder $query) => $query->whereKeyNot($ignoreId))
            ->exists();
    }

    /**
     * Simpan data baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Model
    {
        return $this->query()->create($data);
    }

    /**
     * Perbarui data dan kembalikan model yang sudah tersegarkan.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Model $model, array $data): Model
    {
        $model->update($data);

        return $model->refresh();
    }

    /**
     * Hapus data.
     */
    public function delete(Model $model): bool
    {
        return (bool) $model->delete();
    }

    /**
     * Hitung data yang cocok dengan kondisi.
     *
     * @param  array<string, mixed>  $where
     */
    public function count(array $where = []): int
    {
        return $this->query()->where($where)->count();
    }

    /**
     * Ambil data yang paling baru diperbarui (hanya kolom yang diperlukan).
     *
     * @param  array<int, string>  $columns
     */
    public function latestUpdated(int $limit = 5, array $columns = ['*']): Collection
    {
        return $this->query()->select($columns)->latest('updated_at')->limit($limit)->get();
    }

    /**
     * Hitung total data dan jumlah draf (is_published = false) dalam satu query agregat.
     *
     * @return array{total: int, drafts: int}
     */
    public function countPublishSummary(): array
    {
        $row = $this->query()
            ->selectRaw('COUNT(*) as total, SUM(CASE WHEN is_published = 0 THEN 1 ELSE 0 END) as drafts')
            ->first();

        return [
            'total' => (int) ($row->total ?? 0),
            'drafts' => (int) ($row->drafts ?? 0),
        ];
    }

    /**
     * Terapkan pencarian berdasarkan id numerik atau slug.
     */
    protected function identifierQuery(Builder $query, int|string $identifier): Builder
    {
        return is_numeric($identifier)
            ? $query->whereKey($identifier)
            : $query->where($this->slugColumn, $identifier);
    }
}
