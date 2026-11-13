<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\HeroRepositoryInterface;
use App\Contracts\Interfaces\HeroServiceInterface;
use App\Enums\UploadDirectoryEnum;
use App\Models\Hero;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class HeroService implements HeroServiceInterface
{
    /**
     * Inisialisasi HeroService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected FileUploadServiceInterface $fileUploadService,
        protected HeroRepositoryInterface $heroRepository,
    ) {}

    /**
     * Ambil seluruh banner beranda sesuai urutan tampil.
     */
    public function getAll(): Collection
    {
        return $this->heroRepository->all();
    }

    /**
     * Ambil banner beranda yang aktif untuk halaman publik.
     */
    public function getActiveHeroes(): Collection
    {
        return $this->heroRepository->active();
    }

    /**
     * Ambil satu banner aktif teratas untuk beranda.
     */
    public function getActiveHero(): ?Hero
    {
        return $this->heroRepository->firstActive();
    }

    /**
     * Ambil banner berdasarkan id, atau gagal.
     */
    public function getById(int|string $id): Hero
    {
        return $this->heroRepository->findOrFail($id);
    }

    /**
     * Simpan banner baru beserta gambar latarnya.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Hero
    {
        if (isset($data['background_image']) && $data['background_image'] instanceof UploadedFile) {
            $data['background_image'] = $this->fileUploadService->upload(
                $data['background_image'],
                UploadDirectoryEnum::HEROES->value
            );
        }

        return $this->heroRepository->create($data);
    }

    /**
     * Perbarui banner dan ganti gambar latarnya bila ada unggahan baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int|string $id, array $data): Hero
    {
        $hero = $this->getById($id);

        if (isset($data['background_image']) && $data['background_image'] instanceof UploadedFile) {
            $data['background_image'] = $this->fileUploadService->replace(
                $data['background_image'],
                $hero->background_image,
                UploadDirectoryEnum::HEROES->value
            );
        }

        return $this->heroRepository->update($hero, $data);
    }

    /**
     * Hapus banner beserta gambar latarnya.
     */
    public function delete(int|string $id): bool
    {
        $hero = $this->getById($id);

        if ($hero->background_image) {
            $this->fileUploadService->delete($hero->background_image);
        }

        return $this->heroRepository->delete($hero);
    }
}
