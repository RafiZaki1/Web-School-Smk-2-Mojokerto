<?php

namespace App\Contracts\Interfaces;

use App\Models\Siswa;
use App\Models\TransaksiBankMini;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

/**
 * Integrasi Tripay closed payment (pola dari api-getskill) untuk SPP sekolah.
 */
interface TripayServiceInterface
{
    /**
     * Kontrak method siap.
     *
     * @return bool
     */
    public function siap(): bool;

    /**
     * Kontrak method handlePaymentChannels.
     *
     * @return Collection
     */
    public function handlePaymentChannels(): Collection;

    /**
     * Kontrak method handlePaymentInstructions.
     *
     * @param  string  $code
     * @return array<int, mixed>
     */
    public function handlePaymentInstructions(string $code): array;

    /**
     * Kontrak method handleGenerateCallbackSignature.
     *
     * @param  Request  $request
     * @return string
     */
    public static function handleGenerateCallbackSignature(Request $request): string;

    /**
     * Kontrak method handleCreateTransaction.
     *
     * @param  TransaksiBankMini  $transaksi
     * @param  Siswa  $siswa
     * @param  Collection  $tagihan
     * @param  string  $method
     * @return array<string, mixed>
     */
    public function handleCreateTransaction(TransaksiBankMini $transaksi, Siswa $siswa, Collection $tagihan, string $method): array;

    /**
     * Kontrak method handleTransactionDetail.
     *
     * @param  string  $reference
     * @return array<string, mixed>
     */
    public function handleTransactionDetail(string $reference): array;
}
