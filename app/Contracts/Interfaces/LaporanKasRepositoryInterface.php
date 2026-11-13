<?php

namespace App\Contracts\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

/**
 * Laporan kas Bank Mini (settlement tunai vs gateway).
 */
interface LaporanKasRepositoryInterface
{
    /**
     * Kontrak method tabunganPerKelas.
     *
     * @return array<string, int>
     */
    public function tabunganPerKelas(): array;

    /**
     * Kontrak method transaksiKelas.
     *
     * @param  string  $kelas
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function transaksiKelas(string $kelas, int $perPage = 25): LengthAwarePaginator;

    /**
     * Kontrak method ringkasanKas.
     *
     * @param  Carbon  $dari
     * @param  Carbon  $sampai
     * @return array<string, array{jumlah: int, total: int, spp: int, tabungan: int}>
     */
    public function ringkasanKas(Carbon $dari, Carbon $sampai): array;

    /**
     * Kontrak method laporanKas.
     *
     * @param  Carbon  $dari
     * @param  Carbon  $sampai
     * @param  ?string  $metode
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function laporanKas(Carbon $dari, Carbon $sampai, ?string $metode, int $perPage = 25): LengthAwarePaginator;
}
