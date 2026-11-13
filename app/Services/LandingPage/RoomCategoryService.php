<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\RoomCategoryRepositoryInterface;
use App\Contracts\Interfaces\RoomCategoryServiceInterface;
use App\Models\RoomCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class RoomCategoryService implements RoomCategoryServiceInterface
{
    /**
     * Inisialisasi RoomCategoryService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected RoomCategoryRepositoryInterface $roomCategoryRepository,
    ) {}

    /**
     * Ambil seluruh kategori ruangan.
     */
    public function getAll(): Collection
    {
        return $this->roomCategoryRepository->getAll();
    }

    /**
     * Ambil kategori ruangan yang aktif.
     */
    public function getActive(): Collection
    {
        return $this->roomCategoryRepository->getActive();
    }

    /**
     * Ambil kategori ruangan berdasarkan id atau slug, atau gagal.
     */
    public function getById(int|string $identifier): RoomCategory
    {
        return $this->roomCategoryRepository->findByIdentifierOrFail($identifier);
    }

    /**
     * Simpan kategori ruangan baru beserta slug unik bila slug tidak dikirim.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): RoomCategory
    {
        if (empty($data['slug']) && ! empty($data['name'])) {
            $data['slug'] = $this->uniqueSlug($data['name']);
        }

        return $this->roomCategoryRepository->create($data);
    }

    /**
     * Perbarui kategori ruangan. Slug baru dibuat unik bila nama berubah dan slug tidak dikirim.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int|string $identifier, array $data): RoomCategory
    {
        $category = $this->getById($identifier);

        if (empty($data['slug']) && ! empty($data['name']) && $data['name'] !== $category->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $category->id);
        }

        return $this->roomCategoryRepository->update($category, $data);
    }

    /**
     * Hapus kategori ruangan.
     */
    public function delete(int|string $identifier): bool
    {
        $category = $this->getById($identifier);

        return $this->roomCategoryRepository->delete($category);
    }

    /**
     * Buat slug unik dari nama kategori dengan akhiran angka bila sudah dipakai.
     */
    private function uniqueSlug(string $name, int|string|null $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $counter = 1;

        while ($this->roomCategoryRepository->slugExists($slug, $ignoreId)) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
