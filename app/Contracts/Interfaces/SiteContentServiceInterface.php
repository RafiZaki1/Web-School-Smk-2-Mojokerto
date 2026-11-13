<?php

namespace App\Contracts\Interfaces;

use App\Models\SiteContent;
use Illuminate\Http\UploadedFile;

interface SiteContentServiceInterface
{
    /**
     * Kontrak method get.
     *
     * @param  string  $key
     * @return SiteContent
     */
    public function get(string $key): SiteContent;

    /**
     * Untuk panel admin: konten yang belum pernah disimpan mengembalikan null.
     *
     * @param  string  $key
     * @return ?SiteContent
     */
    public function find(string $key): ?SiteContent;

    /**
     * Kontrak method put.
     *
     * @param  string  $key
     * @param  array  $value
     * @return SiteContent
     */
    public function put(string $key, array $value): SiteContent;

    /**
     * Simpan gambar/berkas untuk konten halaman dan kembalikan path relatifnya.
     *
     * @param  string  $key
     * @param  UploadedFile  $file
     * @return string
     */
    public function upload(string $key, UploadedFile $file): string;
}
