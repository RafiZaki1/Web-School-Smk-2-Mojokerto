<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService implements FileUploadServiceInterface
{
    /**
     * Simpan berkas unggahan ke folder tertentu pada disk publik.
     */
    public function upload(UploadedFile $file, string $directory): string
    {
        return $file->store($directory, 'public');
    }

    /**
     * Hapus berkas dari disk publik bila berkasnya ada.
     */
    public function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Ganti berkas lama dengan berkas baru. Berkas lama dihapus bila berkas baru tersedia.
     */
    public function replace(?UploadedFile $newFile, ?string $oldPath, string $directory): ?string
    {
        if ($newFile) {
            $this->delete($oldPath);

            return $this->upload($newFile, $directory);
        }

        return $oldPath;
    }

    /**
     * Ubah path berkas menjadi URL publik. URL yang sudah lengkap dikembalikan apa adanya.
     */
    public function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        return url(Storage::url($path));
    }
}
