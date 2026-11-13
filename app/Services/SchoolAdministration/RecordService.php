<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\RecordRepositoryInterface;
use App\Contracts\Interfaces\RecordServiceInterface;
use App\Services\Concerns\ManagesMedia;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Alur bersama data TU tanpa slug. Turunan cukup menentukan field berkas
 * dan, bila perlu, merapikan input lewat transform().
 */
abstract class RecordService implements RecordServiceInterface
{
    use ManagesMedia;

    /** @var array<string, string> Field berkas => direktori unggahan. */
    protected array $fileFields = [];

    /**
     * Inisialisasi RecordService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  RecordRepositoryInterface  $repository
     * @param  FileUploadServiceInterface  $files
     */
    public function __construct(
        protected RecordRepositoryInterface $repository,
        protected FileUploadServiceInterface $files,
    ) {}

    /**
     * Ambil data yang tampil di web publik.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection
     */
    public function getPublished(array $filters = []): Collection
    {
        return $this->repository->published($filters);
    }

    /**
     * Ambil seluruh data untuk tabel admin sesuai filter.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        return $this->repository->filtered($filters);
    }

    /**
     * Ambil satu data berdasarkan id.
     *
     * @param  int|string  $id
     * @return Model
     */
    public function find(int|string $id): Model
    {
        return $this->repository->findOrFail($id);
    }

    /**
     * Simpan data baru beserta berkasnya.
     *
     * @param  array<string, mixed>  $data
     * @return Model
     */
    public function create(array $data): Model
    {
        return $this->repository->create($this->prepare($data));
    }

    /**
     * Perbarui data; berkas lama dihapus bila diganti.
     *
     * @param  array<string, mixed>  $data
     * @param  int|string  $id
     * @return Model
     */
    public function update(int|string $id, array $data): Model
    {
        $model = $this->find($id);

        return $this->repository->update($model, $this->prepare($data, $model));
    }

    /**
     * Hapus data beserta berkasnya.
     *
     * @param  int|string  $id
     * @return bool
     */
    public function delete(int|string $id): bool
    {
        $model = $this->find($id);
        $this->deletePaths(array_map(fn (string $field) => $model->{$field}, array_keys($this->fileFields)));

        return $this->repository->delete($model);
    }

    /**
     * Simpan berkas yang dikirim lalu jalankan transform() milik turunan.
     *
     * @param  array<string, mixed>  $data
     * @param  ?Model  $model
     * @return array<string, mixed>
     */
    protected function prepare(array $data, ?Model $model = null): array
    {
        foreach ($this->fileFields as $field => $directory) {
            if (array_key_exists($field, $data)) {
                $data[$field] = $this->storeFile($data[$field], $directory, $model?->{$field});
            }
        }

        return $this->transform($data, $model);
    }

    /**
     * Hook per modul untuk merapikan input sebelum ditulis ke database.
     *
     * @param  array<string, mixed>  $data
     * @param  ?Model  $model
     * @return array<string, mixed>
     */
    protected function transform(array $data, ?Model $model): array
    {
        return $data;
    }
}
