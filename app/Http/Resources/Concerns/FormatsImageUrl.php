<?php

namespace App\Http\Resources\Concerns;

use Illuminate\Support\Facades\Storage;

/**
 * Mengubah path berkas tersimpan menjadi URL publik lengkap, dipakai bersama oleh Resource yang memiliki gambar.
 */
trait FormatsImageUrl
{
    /**
     * Bentuk URL lengkap dari path berkas tersimpan. URL lengkap dan aset bawaan frontend dikembalikan apa adanya.
     */
    protected function formatImageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        if (str_starts_with($path, '/')) {
            return $path;
        }

        return url(Storage::url($path));
    }

    /**
     * Bentuk URL publik untuk daftar path berkas, misalnya galeri.
     *
     * @param  array<int, string>|null  $paths
     * @return array<int, string|null>
     */
    protected function formatImageUrls(?array $paths): array
    {
        return array_values(array_filter(array_map(fn ($path) => $this->formatImageUrl($path), $paths ?? [])));
    }
}
