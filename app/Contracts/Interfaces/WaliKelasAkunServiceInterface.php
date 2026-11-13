<?php

namespace App\Contracts\Interfaces;

/**
 * Penyusunan data akun wali kelas sebelum disimpan repository.
 */
interface WaliKelasAkunServiceInterface
{
    /**
     * Kontrak method payloadAkun.
     *
     * @param  array<string, mixed>  $data
     * @param  string  $kelas
     * @param  bool  $baru
     * @return array<string, mixed>
     */
    public function payloadAkun(array $data, string $kelas, bool $baru): array;
}
