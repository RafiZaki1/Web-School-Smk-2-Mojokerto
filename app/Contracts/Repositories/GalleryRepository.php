<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\GalleryRepositoryInterface;
use App\Models\Gallery;
use Illuminate\Database\Eloquent\Collection;

class GalleryRepository implements GalleryRepositoryInterface
{
    /**
     * Ambil seluruh foto galeri, opsional difilter per kategori.
     */
    public function all(?string $category = null): Collection
    {
        return Gallery::query()->category($category)->ordered()->get();
    }

    /**
     * Ambil foto galeri yang aktif, opsional difilter per kategori.
     */
    public function active(?string $category = null): Collection
    {
        return Gallery::query()->active()->category($category)->ordered()->get();
    }

    /**
     * Cari foto galeri berdasarkan id, atau gagal.
     */
    public function findOrFail(int|string $id): Gallery
    {
        return Gallery::query()->findOrFail($id);
    }

    /**
     * Simpan foto galeri baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Gallery
    {
        return Gallery::query()->create($data);
    }

    /**
     * Perbarui foto galeri dan kembalikan data terbarunya.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Gallery $gallery, array $data): Gallery
    {
        $gallery->update($data);

        return $gallery->refresh();
    }

    /**
     * Hapus foto galeri.
     */
    public function delete(Gallery $gallery): bool
    {
        return (bool) $gallery->delete();
    }
}
