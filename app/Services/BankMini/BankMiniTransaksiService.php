<?php

namespace App\Services\BankMini;

use App\Contracts\Interfaces\BankMiniTransaksiServiceInterface;
use App\Contracts\Interfaces\SppBillingServiceInterface;
use App\Enums\BankMini\MetodeBayarEnum;
use App\Enums\BankMini\StatusTransaksiEnum;
use App\Models\Siswa;
use App\Models\TagihanSpp;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class BankMiniTransaksiService implements BankMiniTransaksiServiceInterface
{
    /**
     * Inisialisasi BankMiniTransaksiService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SppBillingServiceInterface  $billing
     */
    public function __construct(
        protected SppBillingServiceInterface $billing,
    ) {}

    /**
     * Susun data transaksi baru. Tunai langsung settlement; gateway pending dengan
     * masa berlaku sesuai kode bayar Tripay.
     *
     * @param  Siswa  $siswa
     * @param  Collection  $tagihan
     * @param  MetodeBayarEnum  $metode
     * @param  ?int  $petugasId
     * @param  ?string  $emailInvoice  email tujuan invoice (khusus gateway)
     * @return array<string, mixed>
     */
    public function payloadTransaksi(Siswa $siswa, Collection $tagihan, MetodeBayarEnum $metode, ?int $petugasId = null, ?string $emailInvoice = null): array
    {
        $total = $this->billing->hitungTotal($tagihan);
        $tunai = $metode === MetodeBayarEnum::TUNAI;

        return [
            'order_id' => $this->buatOrderId($metode),
            'siswa_id' => $siswa->id,
            'email_invoice' => $emailInvoice ? mb_strtolower(trim($emailInvoice)) : null,
            'metode' => $metode->value,
            'channel' => $tunai ? 'loket' : null,
            'total_nominal' => $total['total'],
            'porsi_spp' => $total['porsi_spp'],
            'porsi_tabungan' => $total['porsi_tabungan'],
            'biaya_admin' => 0,
            'status' => ($tunai ? StatusTransaksiEnum::SETTLEMENT : StatusTransaksiEnum::PENDING)->value,
            'expires_at' => $tunai ? null : now()->addHours((int) config('bank_mini.gateway.expiry_hours')),
            'paid_at' => $tunai ? now() : null,
            'petugas_id' => $petugasId,
        ];
    }

    /**
     * Susun baris transaksi_detail_bulan dengan salinan nominal per bulan.
     *
     * @param  int  $transaksiId
     * @param  Collection  $tagihan
     * @return array<int, array<string, mixed>>
     */
    public function payloadDetail(int $transaksiId, Collection $tagihan): array
    {
        $now = now();

        return $tagihan->map(fn (TagihanSpp $item) => [
            'transaksi_id' => $transaksiId,
            'tagihan_spp_id' => $item->id,
            'nominal_spp' => $item->nominal_spp,
            'nominal_tabungan' => $item->nominal_tabungan,
            'created_at' => $now,
            'updated_at' => $now,
        ])->values()->all();
    }

    /**
     * Kolom transaksi_bank_mini dari respons Tripay transaction/create.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function atributTransaksi(array $data): array
    {
        return [
            'reference' => (string) $data['reference'],
            'channel' => $data['payment_method'] ?? null,
            'channel_nama' => $data['payment_name'] ?? null,
            'biaya_admin' => (int) ($data['fee_customer'] ?? 0),
            'pay_code' => $data['pay_code'] ?? null,
            'checkout_url' => $data['checkout_url'] ?? null,
            'expires_at' => isset($data['expired_time']) ? Carbon::createFromTimestamp((int) $data['expired_time']) : null,
            'gateway_payload' => json_encode(array_intersect_key($data, array_flip([
                'reference', 'merchant_ref', 'payment_method', 'payment_name', 'amount', 'fee_customer',
                'pay_code', 'pay_url', 'checkout_url', 'qr_url', 'qr_string', 'expired_time', 'instructions',
            ]))),
        ];
    }

    /**
     * Kolom yang diperbarui saat status final diterima (callback atau transaction/detail).
     *
     * @param  array<string, mixed>  $data
     * @param  bool  $settlement
     * @return array<string, mixed>
     */
    public function atributStatus(array $data, bool $settlement): array
    {
        $paidAt = $data['paid_at'] ?? null;

        return array_filter([
            'channel_nama' => $data['payment_name'] ?? $data['payment_method'] ?? null,
            'paid_at' => $settlement ? ($paidAt ? Carbon::createFromTimestamp((int) $paidAt) : now()) : null,
        ], fn ($value) => $value !== null);
    }

    /**
     * Buat order_id unik, mis. "SPP-G-261113-8F3K2Q9A" (G = gateway, T = tunai).
     *
     * @param  MetodeBayarEnum  $metode
     * @return string
     */
    private function buatOrderId(MetodeBayarEnum $metode): string
    {
        $kode = $metode === MetodeBayarEnum::TUNAI ? 'T' : 'G';

        return 'SPP-'.$kode.'-'.now()->format('ymd').'-'.Str::upper(Str::random(8));
    }
}
