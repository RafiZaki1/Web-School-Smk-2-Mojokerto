<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\SiteContentRepositoryInterface;
use App\Contracts\Interfaces\SiteContentServiceInterface;
use App\Enums\UploadDirectoryEnum;
use App\Models\SiteContent;
use App\Services\Concerns\ManagesMedia;
use Illuminate\Http\UploadedFile;

/**
 * Konten halaman semi-statis berbentuk JSON bebas. Gambar diunggah terpisah
 * (upload()) lalu path-nya disimpan di dalam JSON; saat disimpan ulang, berkas
 * unggahan yang tidak dipakai lagi ikut dihapus.
 */
class SiteContentService implements SiteContentServiceInterface
{
    use ManagesMedia;

    /**
     * Inisialisasi SiteContentService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected SiteContentRepositoryInterface $repository,
        protected FileUploadServiceInterface $files,
    ) {}

    /**
     * Ambil konten halaman berdasarkan kunci, atau gagal.
     */
    public function get(string $key): SiteContent
    {
        return $this->repository->findByKeyOrFail($key);
    }

    /**
     * Ambil konten halaman berdasarkan kunci, atau null bila belum ada.
     */
    public function find(string $key): ?SiteContent
    {
        return $this->repository->findByKey($key);
    }

    /**
     * Simpan isi konten halaman dan hapus unggahan lama yang sudah tidak dipakai.
     *
     * @param  array<string, mixed>  $value
     */
    public function put(string $key, array $value): SiteContent
    {
        $old = $this->repository->findByKey($key)?->value ?? [];
        $value = $this->normalizeTree($value);

        $content = $this->repository->upsert($key, $value);

        foreach (array_diff($this->uploadedPaths($old), $this->uploadedPaths($value)) as $removed) {
            $this->deleteStored($removed);
        }

        return $content;
    }

    /**
     * Unggah gambar konten halaman ke folder khusus kunci tersebut.
     */
    public function upload(string $key, UploadedFile $file): string
    {
        return $this->files->upload($file, UploadDirectoryEnum::SITE_CONTENTS->value.'/'.$key);
    }

    /**
     * Ubah URL penuh dari API menjadi path relatif di seluruh nilai JSON.
     *
     * @param  array<string, mixed>  $value
     * @return array<string, mixed>
     */
    protected function normalizeTree(array $value): array
    {
        return array_map(function ($item) {
            if (is_array($item)) {
                return $this->normalizeTree($item);
            }

            return is_string($item) && preg_match('#^(?:https?://[^/]+)?/storage/#', $item)
                ? $this->normalizePath($item)
                : $item;
        }, $value);
    }

    /**
     * Ambil seluruh path unggahan konten halaman yang tersimpan di dalam nilai JSON.
     *
     * @param  array<string, mixed>  $value
     * @return array<int, string>
     */
    protected function uploadedPaths(array $value): array
    {
        $paths = [];

        array_walk_recursive($value, function ($item) use (&$paths) {
            if (is_string($item) && str_starts_with($item, UploadDirectoryEnum::SITE_CONTENTS->value.'/')) {
                $paths[] = $item;
            }
        });

        return array_values(array_unique($paths));
    }
}
