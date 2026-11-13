<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;

/**
 * Notifikasi pembayaran online untuk petugas Bank Mini.
 */
interface NotifikasiBankMiniRepositoryInterface
{
    /**
     * Kontrak method catat.
     *
     * @param  int  $transaksiId
     * @param  string  $judul
     * @param  string  $pesan
     * @return int
     */
    public function catat(int $transaksiId, string $judul, string $pesan): int;

    /**
     * Kontrak method terbaru.
     *
     * @param  int  $limit
     * @return Collection
     */
    public function terbaru(int $limit = 15): Collection;

    /**
     * Kontrak method jumlahBelumDibaca.
     *
     * @return int
     */
    public function jumlahBelumDibaca(): int;

    /**
     * Kontrak method tandaiSemuaDibaca.
     *
     * @return int
     */
    public function tandaiSemuaDibaca(): int;
}
