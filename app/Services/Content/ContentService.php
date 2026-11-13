<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\ContentRepositoryInterface;
use App\Contracts\Interfaces\ContentServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Services\Concerns\ManagesMedia;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Alur bersama konten publik: daftar & detail yang terbit, CRUD admin,
 * slug unik otomatis, dan pengelolaan berkas gambar.
 */
abstract class ContentService implements ContentServiceInterface
{
    use ManagesMedia;

    protected string $slugSource = 'title';

    /** @var array<string, string> */
    protected array $fileFields = [];

    /** @var array<string, string> */
    protected array $fileListFields = [];

    /**
     * Inisialisasi ContentService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected ContentRepositoryInterface $repository,
        protected FileUploadServiceInterface $files,
    ) {}

    /**
     * Ambil daftar konten yang diterbitkan beserta filter.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getPublished(array $filters = []): Collection
    {
        return $this->repository->published($filters);
    }

    /**
     * Ambil detail konten yang diterbitkan berdasarkan id atau slug.
     */
    public function getPublishedByIdentifier(int|string $identifier): Model
    {
        return $this->repository->findPublishedOrFail($identifier);
    }

    /**
     * Ambil seluruh konten untuk admin.
     */
    public function getAll(): Collection
    {
        return $this->repository->all();
    }

    /**
     * Ambil konten berdasarkan id atau slug, termasuk yang belum diterbitkan.
     */
    public function getByIdentifier(int|string $identifier): Model
    {
        return $this->repository->findByIdentifierOrFail($identifier);
    }

    /**
     * Simpan konten baru beserta berkas dan slug unik.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Model
    {
        $data = $this->prepare($data);
        $data['slug'] = $this->uniqueSlug(($data['slug'] ?? null) ?: (string) ($data[$this->slugSource] ?? ''));

        return $this->repository->create($data);
    }

    /**
     * Perbarui konten, termasuk berkas dan slug unik bila slug ikut diubah.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(int|string $identifier, array $data): Model
    {
        $model = $this->getByIdentifier($identifier);
        $data = $this->prepare($data, $model);

        if (! empty($data['slug'])) {
            $data['slug'] = $this->uniqueSlug($data['slug'], $model->getKey());
        } else {
            unset($data['slug']);
        }

        return $this->repository->update($model, $data);
    }

    /**
     * Hapus konten beserta seluruh berkas miliknya.
     */
    public function delete(int|string $identifier): bool
    {
        $model = $this->getByIdentifier($identifier);

        $this->deletePaths($this->mediaPaths($model));

        return $this->repository->delete($model);
    }

    /**
     * Simpan berkas dan rapikan input sebelum ditulis ke database.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function prepare(array $data, ?Model $model = null): array
    {
        foreach ($this->fileFields as $field => $directory) {
            if (array_key_exists($field, $data)) {
                $data[$field] = $this->storeFile($data[$field], $directory, $model?->{$field});
            }
        }

        foreach ($this->fileListFields as $field => $directory) {
            if (array_key_exists($field, $data)) {
                $data[$field] = $this->storeFileList($data[$field], $directory, $model?->{$field} ?? []);
            }
        }

        return $this->transform($data, $model);
    }

    /**
     * Hook per modul untuk merapikan field turunan atau bersarang.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function transform(array $data, ?Model $model): array
    {
        return $data;
    }

    /**
     * Kumpulkan seluruh path berkas milik record, dipakai saat record dihapus.
     *
     * @return array<int, mixed>
     */
    protected function mediaPaths(Model $model): array
    {
        return collect(array_merge(array_keys($this->fileFields), array_keys($this->fileListFields)))
            ->map(fn (string $field) => $model->{$field})
            ->filter()
            ->values()
            ->all();
    }

    /**
     * Buat slug unik dari sumber teks dengan akhiran angka bila sudah dipakai.
     */
    protected function uniqueSlug(string $source, int|string|null $ignoreId = null): string
    {
        $base = Str::slug($source) ?: Str::lower(Str::random(8));
        $slug = $base;
        $suffix = 2;

        while ($this->repository->slugExists($slug, $ignoreId)) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    /**
     * Buang baris kosong dari daftar teks, misalnya tanggung jawab atau kualifikasi.
     *
     * @param  array<int, mixed>|null  $items
     * @return array<int, mixed>
     */
    protected function cleanList(?array $items): array
    {
        return collect($items ?? [])
            ->map(fn ($item) => is_string($item) ? trim($item) : $item)
            ->filter(fn ($item) => $item !== null && $item !== '' && $item !== [])
            ->values()
            ->all();
    }
}
