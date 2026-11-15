<?php

namespace App\Contracts\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Daftar transaksi untuk halaman Pembayaran Masuk panel petugas Bank Mini.
 */
interface PembayaranMasukRepositoryInterface
{
    /**
     * Kontrak method daftar.
     *
     * @param  ?string  $status
     * @param  ?string  $cari
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function daftar(?string $status, ?string $cari, int $perPage = 20): LengthAwarePaginator;

    /**
     * Kontrak method jumlahPerStatus.
     *
     * @return array<string, int>
     */
    public function jumlahPerStatus(): array;
}
