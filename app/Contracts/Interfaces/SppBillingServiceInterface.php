<?php

namespace App\Contracts\Interfaces;

use Illuminate\Support\Collection;

/**
 * Kalkulasi tagihan SPP: pembentukan 12 bulan, ringkasan siswa, dan matriks kelas.
 */
interface SppBillingServiceInterface
{
    /**
     * Kontrak method susunTagihan.
     *
     * @param  array<int, int>  $siswaIds
     * @param  string  $tahunAjaran
     * @return array<int, array<string, mixed>>
     */
    public function susunTagihan(array $siswaIds, string $tahunAjaran): array;

    /**
     * Kontrak method hitungTotal.
     *
     * @param  Collection  $tagihan
     * @return array{bulan: int, porsi_spp: int, porsi_tabungan: int, total: int}
     */
    public function hitungTotal(Collection $tagihan): array;

    /**
     * Kontrak method ringkasanSiswa.
     *
     * @param  Collection  $tagihan
     * @param  int  $tabungan
     * @param  int  $pending
     * @return array<string, int>
     */
    public function ringkasanSiswa(Collection $tagihan, int $tabungan, int $pending): array;

    /**
     * Kontrak method matriksKelas.
     *
     * @param  Collection  $siswa
     * @param  Collection  $tagihan
     * @param  array<int, int>  $tabungan
     * @return array<int, array<string, mixed>>
     */
    public function matriksKelas(Collection $siswa, Collection $tagihan, array $tabungan): array;

    /**
     * Kontrak method pilihanTahun.
     *
     * @param  array<int, string>  $tersedia
     * @return array<int, string>
     */
    public function pilihanTahun(array $tersedia): array;
}
