<?php

namespace App\Contracts\Interfaces;

use Illuminate\Http\UploadedFile;

/**
 * Impor data kelulusan seluruh kelas XII dari satu file Excel/CSV.
 */
interface GraduateImportServiceInterface
{
    /**
     * Kontrak method import.
     *
     * @param  UploadedFile  $file
     * @param  int  $defaultYear
     * @return array{total: int, created: int, updated: int, skipped: int, errors: array<int, array{row: int, message: string}>}
     */
    public function import(UploadedFile $file, int $defaultYear): array;
}
