<?php

namespace App\Contracts\Interfaces;

use App\Enums\BankMini\MetodeBayarEnum;
use App\Models\Siswa;
use Illuminate\Support\Collection;

/**
 * Penyusunan payload transaksi Bank Mini sebelum disimpan repository.
 */
interface BankMiniTransaksiServiceInterface
{
    /**
     * Kontrak method payloadTransaksi.
     *
     * @param  Siswa  $siswa
     * @param  Collection  $tagihan
     * @param  MetodeBayarEnum  $metode
     * @param  ?int  $petugasId
     * @param  ?string  $emailInvoice
     * @return array<string, mixed>
     */
    public function payloadTransaksi(Siswa $siswa, Collection $tagihan, MetodeBayarEnum $metode, ?int $petugasId = null, ?string $emailInvoice = null): array;

    /**
     * Kontrak method payloadDetail.
     *
     * @param  int  $transaksiId
     * @param  Collection  $tagihan
     * @return array<int, array<string, mixed>>
     */
    public function payloadDetail(int $transaksiId, Collection $tagihan): array;

    /**
     * Kontrak method atributTransaksi.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function atributTransaksi(array $data): array;

    /**
     * Kontrak method atributStatus.
     *
     * @param  array<string, mixed>  $data
     * @param  bool  $settlement
     * @return array<string, mixed>
     */
    public function atributStatus(array $data, bool $settlement): array;
}
