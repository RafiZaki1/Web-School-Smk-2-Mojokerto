<?php

namespace App\Contracts\Interfaces;

use App\Enums\BankMini\StatusTransaksiEnum;
use App\Models\TransaksiBankMini;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Transaksi pembayaran SPP Bank Mini.
 */
interface TransaksiBankMiniRepositoryInterface
{
    /**
     * Kontrak method create.
     *
     * @param  array<string, mixed>  $data
     * @return Model
     */
    public function create(array $data): Model;

    /**
     * Kontrak method findByOrderId.
     *
     * @param  string  $orderId
     * @return ?TransaksiBankMini
     */
    public function findByOrderId(string $orderId): ?TransaksiBankMini;

    /**
     * Kontrak method detailOrFail.
     *
     * @param  string  $orderId
     * @param  ?int  $siswaId
     * @return TransaksiBankMini
     */
    public function detailOrFail(string $orderId, ?int $siswaId = null): TransaksiBankMini;

    /**
     * Kontrak method simpanGateway.
     *
     * @param  int  $id
     * @param  array<string, mixed>  $data
     * @return int
     */
    public function simpanGateway(int $id, array $data): int;

    /**
     * Kontrak method findGateway.
     *
     * @param  string  $orderId
     * @param  string  $reference
     * @return ?TransaksiBankMini
     */
    public function findGateway(string $orderId, string $reference): ?TransaksiBankMini;

    /**
     * Kontrak method ubahStatus.
     *
     * @param  string  $orderId
     * @param  array<int, StatusTransaksiEnum>  $dari
     * @param  StatusTransaksiEnum  $ke
     * @param  array<string, mixed>  $atribut
     * @return int
     */
    public function ubahStatus(string $orderId, array $dari, StatusTransaksiEnum $ke, array $atribut = []): int;

    /**
     * Kontrak method riwayatSiswa.
     *
     * @param  int  $siswaId
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function riwayatSiswa(int $siswaId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Kontrak method pendingGatewaySiswa.
     *
     * @param  int  $siswaId
     * @return Collection
     */
    public function pendingGatewaySiswa(int $siswaId): Collection;

    /**
     * Kontrak method pendingKedaluwarsa.
     *
     * @param  ?int  $siswaId
     * @param  int  $limit
     * @return Collection
     */
    public function pendingKedaluwarsa(?int $siswaId = null, int $limit = 100): Collection;

    /**
     * Kontrak method totalTabungan.
     *
     * @param  int  $siswaId
     * @return int
     */
    public function totalTabungan(int $siswaId): int;

    /**
     * Kontrak method tabunganPerSiswa.
     *
     * @param  array<int, int>  $siswaIds
     * @return array<int, int>
     */
    public function tabunganPerSiswa(array $siswaIds): array;

    /**
     * Kontrak method emailTerakhir.
     *
     * @param  int  $siswaId
     * @return ?string
     */
    public function emailTerakhir(int $siswaId): ?string;
}
