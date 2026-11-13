<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\AlumniRepositoryInterface;
use App\Contracts\Interfaces\AlumniServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Enums\UploadDirectoryEnum;
use App\Models\Alumni;
use App\Services\Concerns\ManagesMedia;
use Illuminate\Database\Eloquent\Collection;

class AlumniService implements AlumniServiceInterface
{
    use ManagesMedia;

    /**
     * Inisialisasi AlumniService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected AlumniRepositoryInterface $repository,
        protected FileUploadServiceInterface $files,
    ) {}

    /**
     * Ambil daftar alumni, opsional hanya yang unggulan.
     */
    public function getList(bool $featuredOnly = false): Collection
    {
        return $this->repository->list($featuredOnly);
    }

    /**
     * Ambil alumni berdasarkan id, atau gagal.
     */
    public function getById(int|string $id): Alumni
    {
        return $this->repository->findOrFail($id);
    }

    /**
     * Simpan alumni baru beserta fotonya.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Alumni
    {
        if (array_key_exists('photo', $data)) {
            $data['photo'] = $this->storeFile($data['photo'], UploadDirectoryEnum::ALUMNI->value);
        }

        return $this->repository->create($data);
    }

    /**
     * Perbarui alumni dan ganti fotonya bila ada unggahan baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int|string $id, array $data): Alumni
    {
        $alumni = $this->getById($id);

        if (array_key_exists('photo', $data)) {
            $data['photo'] = $this->storeFile($data['photo'], UploadDirectoryEnum::ALUMNI->value, $alumni->photo);
        }

        return $this->repository->update($alumni, $data);
    }

    /**
     * Hapus alumni beserta fotonya.
     */
    public function delete(int|string $id): bool
    {
        $alumni = $this->getById($id);
        $this->deleteStored($alumni->photo);

        return $this->repository->delete($alumni);
    }
}
