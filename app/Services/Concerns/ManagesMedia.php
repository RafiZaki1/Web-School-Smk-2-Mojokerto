<?php

namespace App\Services\Concerns;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use Illuminate\Http\UploadedFile;

/**
 * Penyimpanan berkas untuk field gambar yang bisa berisi unggahan baru
 * (UploadedFile) atau path lama yang dikirim balik oleh form admin.
 * Berkas lama yang tidak dipakai lagi dihapus dari disk public.
 *
 * @property FileUploadServiceInterface $files
 */
trait ManagesMedia
{
    /** Satu berkas: unggah baru, pertahankan path lama, atau kosongkan. */
    protected function storeFile(mixed $value, string $directory, ?string $old = null): ?string
    {
        if ($value instanceof UploadedFile) {
            $this->deleteStored($old);

            return $this->files->upload($value, $directory);
        }

        $path = $this->normalizePath($value);
        if ($path !== $old) {
            $this->deleteStored($old);
        }

        return $path;
    }

    /** Daftar berkas (galeri): urutan mengikuti input, yang dibuang ikut dihapus. */
    protected function storeFileList(?array $values, string $directory, ?array $old = []): array
    {
        $values = $this->inInputOrder($values);
        $paths = [];
        foreach ($values ?? [] as $value) {
            $path = $value instanceof UploadedFile
                ? $this->files->upload($value, $directory)
                : $this->normalizePath($value);

            if ($path) {
                $paths[] = $path;
            }
        }

        foreach (array_diff($old ?? [], $paths) as $removed) {
            $this->deleteStored($removed);
        }

        return $paths;
    }

    /**
     * Daftar objek yang salah satu kuncinya berkas, mis. fasilitas [{title, image}]
     * atau mitra [{name, logo}].
     */
    protected function storeItemFiles(?array $items, string $fileKey, string $directory, ?array $oldItems = []): array
    {
        $result = [];
        foreach ($this->inInputOrder($items) as $item) {
            if (! is_array($item)) {
                continue;
            }

            $value = $item[$fileKey] ?? null;
            $item[$fileKey] = $value instanceof UploadedFile
                ? $this->files->upload($value, $directory)
                : $this->normalizePath($value);

            $result[] = $item;
        }

        $kept = array_filter(array_column($result, $fileKey));
        foreach (array_diff(array_filter(array_column($oldItems ?? [], $fileKey)), $kept) as $removed) {
            $this->deleteStored($removed);
        }

        return $result;
    }

    /**
     * Multipart menggabungkan input teks & berkas per indeks ("galeri[1]" teks lebih dulu
     * dari "galeri[0]" berkas), jadi urutkan ulang berdasarkan indeks yang dikirim form.
     */
    protected function inInputOrder(?array $values): array
    {
        $values ??= [];
        if (array_is_list($values)) {
            return $values;
        }

        ksort($values, SORT_NUMERIC);

        return array_values($values);
    }

    /** Hapus semua berkas milik sebuah record saat record dihapus. */
    protected function deletePaths(array $paths): void
    {
        foreach ($paths as $path) {
            if (is_array($path)) {
                $this->deletePaths($path);
            } elseif (is_string($path)) {
                $this->deleteStored($path);
            }
        }
    }

    /** URL penuh dari API (http://host/storage/x.jpg) dikembalikan ke path relatif disk. */
    protected function normalizePath(mixed $value): ?string
    {
        if (! is_string($value) || trim($value) === '') {
            return null;
        }

        $value = trim($value);

        if (preg_match('#^(?:https?://[^/]+)?/storage/(.+)$#', $value, $matches)) {
            return $matches[1];
        }

        return $value;
    }

    /** Hanya berkas unggahan yang dihapus, bukan aset FE ("/images/...") atau URL luar. */
    protected function deleteStored(?string $path): void
    {
        if ($path && ! str_starts_with($path, '/') && ! filter_var($path, FILTER_VALIDATE_URL)) {
            $this->files->delete($path);
        }
    }
}
