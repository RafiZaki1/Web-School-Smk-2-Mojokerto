<?php

namespace App\Contracts\Interfaces;

use Illuminate\Support\Collection;

/**
 * Rekap dan filter halaman Monitoring Kelas (per jurusan, kelas, status lunas).
 */
interface MonitoringKelasServiceInterface
{
    /**
     * Kontrak method rekapKelas.
     *
     * @param  array<int, string>  $daftarKelas
     * @param  Collection  $rekap
     * @param  array<string, int>  $siswa
     * @param  array<string, int>  $tabungan
     * @param  Collection  $wali
     * @return array<int, array<string, mixed>>
     */
    public function rekapKelas(array $daftarKelas, Collection $rekap, array $siswa, array $tabungan, Collection $wali): array;

    /**
     * Kontrak method saringRekap.
     *
     * @param  array<int, array<string, mixed>>  $baris
     * @param  ?string  $jurusan
     * @param  ?string  $status
     * @return array<int, array<string, mixed>>
     */
    public function saringRekap(array $baris, ?string $jurusan, ?string $status): array;

    /**
     * Kontrak method ringkasan.
     *
     * @param  array<int, array<string, mixed>>  $baris
     * @return array<string, int>
     */
    public function ringkasan(array $baris): array;

    /**
     * Kontrak method saringMatriks.
     *
     * @param  array<int, array<string, mixed>>  $matriks
     * @param  ?string  $status
     * @return array<int, array<string, mixed>>
     */
    public function saringMatriks(array $matriks, ?string $status): array;
}
