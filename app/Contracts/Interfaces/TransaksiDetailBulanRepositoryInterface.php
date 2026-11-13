<?php

namespace App\Contracts\Interfaces;

use Illuminate\Support\Collection;

/**
 * Rincian bulan yang dibayar per transaksi.
 */
interface TransaksiDetailBulanRepositoryInterface
{
    /**
     * Kontrak method insertBanyak.
     *
     * @param  array<int, array<string, mixed>>  $rows
     * @return bool
     */
    public function insertBanyak(array $rows): bool;

    /**
     * Kontrak method tagihanIds.
     *
     * @param  int  $transaksiId
     * @return array<int, int>
     */
    public function tagihanIds(int $transaksiId): array;

    /**
     * Kontrak method pembayaranLunas.
     *
     * @param  array<int, int>  $tagihanIds
     * @return Collection
     */
    public function pembayaranLunas(array $tagihanIds): Collection;
}
