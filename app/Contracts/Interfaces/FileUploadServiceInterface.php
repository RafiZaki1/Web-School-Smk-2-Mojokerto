<?php

namespace App\Contracts\Interfaces;

use Illuminate\Http\UploadedFile;

interface FileUploadServiceInterface
{
    /**
     * Kontrak method upload.
     *
     * @param  UploadedFile  $file
     * @param  string  $directory
     * @return string
     */
    public function upload(UploadedFile $file, string $directory): string;

    /**
     * Kontrak method delete.
     *
     * @param  ?string  $path
     * @return void
     */
    public function delete(?string $path): void;

    /**
     * Kontrak method replace.
     *
     * @param  ?UploadedFile  $newFile
     * @param  ?string  $oldPath
     * @param  string  $directory
     * @return ?string
     */
    public function replace(?UploadedFile $newFile, ?string $oldPath, string $directory): ?string;

    /**
     * Kontrak method url.
     *
     * @param  ?string  $path
     * @return ?string
     */
    public function url(?string $path): ?string;
}
