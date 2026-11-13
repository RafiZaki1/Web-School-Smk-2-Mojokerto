<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\RoomCategoryRepositoryInterface;
use App\Models\RoomCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class RoomCategoryRepository implements RoomCategoryRepositoryInterface
{
    /**
     * Ambil seluruh kategori ruangan diurutkan dari id.
     */
    public function getAll(): Collection
    {
        return RoomCategory::query()->orderBy('id')->get();
    }

    /**
     * Ambil kategori ruangan yang aktif diurutkan dari id.
     */
    public function getActive(): Collection
    {
        return RoomCategory::query()->active()->orderBy('id')->get();
    }

    /**
     * Cari kategori berdasarkan id atau slug, atau gagal.
     */
    public function findByIdentifierOrFail(int|string $identifier): RoomCategory
    {
        if (is_numeric($identifier)) {
            return RoomCategory::whereKey($identifier)->firstOrFail();
        }

        return RoomCategory::where('slug', $identifier)->firstOrFail();
    }

    /**
     * Periksa apakah slug sudah dipakai kategori lain.
     */
    public function slugExists(string $slug, int|string|null $ignoreId = null): bool
    {
        return RoomCategory::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn (Builder $query) => $query->whereKeyNot($ignoreId))
            ->exists();
    }

    /**
     * Simpan kategori ruangan baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): RoomCategory
    {
        return RoomCategory::create($data);
    }

    /**
     * Perbarui kategori ruangan dan kembalikan data terbarunya.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(RoomCategory $category, array $data): RoomCategory
    {
        $category->update($data);

        return $category->fresh();
    }

    /**
     * Hapus kategori ruangan.
     */
    public function delete(RoomCategory $category): bool
    {
        return (bool) $category->delete();
    }
}
