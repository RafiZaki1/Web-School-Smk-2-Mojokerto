<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\GalleryRepositoryInterface;
use App\Contracts\Interfaces\GalleryServiceInterface;
use App\Enums\UploadDirectoryEnum;
use App\Models\Gallery;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class GalleryService implements GalleryServiceInterface
{
    /**
     * Inisialisasi GalleryService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected FileUploadServiceInterface $fileUploadService,
        protected GalleryRepositoryInterface $galleryRepository,
    ) {}

    /**
     * Ambil seluruh foto galeri, opsional difilter per kategori.
     */
    public function getAll(?string $category = null): Collection
    {
        return $this->galleryRepository->all($category);
    }

    /**
     * Ambil foto galeri yang aktif untuk halaman publik, opsional difilter per kategori.
     */
    public function getActiveGalleries(?string $category = null): Collection
    {
        return $this->galleryRepository->active($category);
    }

    /**
     * Ambil foto galeri berdasarkan id, atau gagal.
     */
    public function getById(int|string $id): Gallery
    {
        return $this->galleryRepository->findOrFail($id);
    }

    /**
     * Simpan foto galeri baru beserta berkas gambarnya.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Gallery
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $this->fileUploadService->upload(
                $data['image'],
                UploadDirectoryEnum::GALLERIES->value
            );
        }

        return $this->galleryRepository->create($data);
    }

    /**
     * Perbarui foto galeri dan ganti gambarnya bila ada unggahan baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int|string $id, array $data): Gallery
    {
        $gallery = $this->getById($id);

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $this->fileUploadService->replace(
                $data['image'],
                $gallery->image,
                UploadDirectoryEnum::GALLERIES->value
            );
        }

        return $this->galleryRepository->update($gallery, $data);
    }

    /**
     * Hapus foto galeri beserta gambarnya.
     */
    public function delete(int|string $id): bool
    {
        $gallery = $this->getById($id);

        if ($gallery->image) {
            $this->fileUploadService->delete($gallery->image);
        }

        return $this->galleryRepository->delete($gallery);
    }
}
