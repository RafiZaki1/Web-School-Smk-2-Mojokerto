<?php

namespace App\Services\BankMini;

use App\Contracts\Interfaces\TripayServiceInterface;
use App\Exceptions\BankMini\GatewayPembayaranException;
use App\Models\Siswa;
use App\Models\TagihanSpp;
use App\Models\TransaksiBankMini;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * Salinan TripayService api-getskill yang disesuaikan untuk SPP: merchant_ref = order_id
 * transaksi_bank_mini, satu order_item per bulan tagihan, dan semua respons gagal dilempar
 * sebagai GatewayPembayaranException supaya controller bisa rollback.
 */
class TripayService implements TripayServiceInterface
{
    private const CACHE_CHANNEL = 'bank-mini:tripay:payment-channels';

    /**
     * Kredensial Tripay sudah lengkap di .env.
     *
     * @return bool
     */
    public function siap(): bool
    {
        return filled(config('tripay.api_key'))
            && filled(config('tripay.private_key'))
            && filled(config('tripay.merchant_code'))
            && filled(config('tripay.api_url'));
    }

    /**
     * Daftar channel aktif dari merchant/payment-channel, dikelompokkan per grup
     * (Virtual Account, E-Wallet, Convenience Store). Disimpan di cache satu jam.
     *
     * @return Collection
     *
     * @throws GatewayPembayaranException
     */
    public function handlePaymentChannels(): Collection
    {
        $channels = Cache::remember(self::CACHE_CHANNEL, now()->addHour(), function () {
            $data = $this->ambilData($this->http()->get($this->url('merchant/payment-channel')), 'payment channel');

            return collect($data)
                ->filter(fn ($item) => is_array($item) && ($item['active'] ?? false))
                ->map(fn (array $item) => [
                    'code' => (string) $item['code'],
                    'name' => (string) $item['name'],
                    'group' => (string) ($item['group'] ?? 'Lainnya'),
                    'icon_url' => $item['icon_url'] ?? null,
                    'fee_flat' => (int) ($item['fee_customer']['flat'] ?? 0),
                    'fee_percent' => (float) ($item['fee_customer']['percent'] ?? 0),
                    'minimum_amount' => (int) ($item['minimum_amount'] ?? 0),
                    'maximum_amount' => (int) ($item['maximum_amount'] ?? 0),
                ])
                ->values()
                ->all();
        });

        return collect($channels)->groupBy('group');
    }

    /**
     * Instruksi pembayaran per kode channel dari payment/instruction.
     *
     * @param  string  $code
     * @return array<int, mixed>
     *
     * @throws GatewayPembayaranException
     */
    public function handlePaymentInstructions(string $code): array
    {
        return $this->ambilData($this->http()->get($this->url('payment/instruction'), ['code' => $code]), 'payment instruction');
    }

    /**
     * Signature callback = HMAC-SHA256(raw body, private key), dibandingkan dengan header X-Callback-Signature.
     *
     * @param  Request  $request
     * @return string
     */
    public static function handleGenerateCallbackSignature(Request $request): string
    {
        return hash_hmac('sha256', $request->getContent(), (string) config('tripay.private_key'));
    }

    /**
     * Buat transaksi closed payment. Signature = HMAC-SHA256(merchant_code + merchant_ref + amount, private key).
     *
     * @param  TransaksiBankMini  $transaksi
     * @param  Siswa  $siswa
     * @param  Collection  $tagihan
     * @param  string  $method
     * @return array<string, mixed>
     *
     * @throws GatewayPembayaranException
     */
    public function handleCreateTransaction(TransaksiBankMini $transaksi, Siswa $siswa, Collection $tagihan, string $method): array
    {
        $amount = $transaksi->total_nominal;

        $payload = [
            'method' => $method,
            'merchant_ref' => $transaksi->order_id,
            'amount' => $amount,
            'customer_name' => mb_substr($siswa->nama, 0, 100),
            'customer_email' => (string) ($transaksi->email_invoice ?: config('bank_mini.gateway.customer_email')),
            'order_items' => $tagihan->map(fn (TagihanSpp $item) => [
                'sku' => 'SPP-'.$item->id,
                'name' => 'SPP '.$item->labelBulan().' (SPP + Tabungan)',
                'price' => $item->total(),
                'quantity' => 1,
            ])->values()->all(),
            'callback_url' => route('bank-mini.webhook'),
            'return_url' => route('bank-mini.transaksi.show', $transaksi->order_id),
            'expired_time' => $transaksi->expires_at?->timestamp ?? now()->addDay()->timestamp,
            'signature' => hash_hmac('sha256', config('tripay.merchant_code').$transaksi->order_id.$amount, (string) config('tripay.private_key')),
        ];

        return $this->ambilData($this->http()->asForm()->post($this->url('transaction/create'), $payload), 'create transaction');
    }

    /**
     * Detail transaksi dari transaction/detail, dipakai tombol cek status.
     *
     * @param  string  $reference
     * @return array<string, mixed>
     *
     * @throws GatewayPembayaranException
     */
    public function handleTransactionDetail(string $reference): array
    {
        return $this->ambilData($this->http()->get($this->url('transaction/detail'), ['reference' => $reference]), 'transaction detail');
    }

    /**
     * Ambil field data dari respons Tripay atau lempar exception bila gagal.
     *
     * @param  Response  $response
     * @param  string  $konteks
     * @return array<mixed>
     *
     * @throws GatewayPembayaranException
     */
    private function ambilData(Response $response, string $konteks): array
    {
        if (! $response->successful() || $response->json('success') !== true || ! is_array($response->json('data'))) {
            throw new GatewayPembayaranException("Tripay {$konteks} gagal: HTTP {$response->status()} ".$response->body());
        }

        return (array) $response->json('data');
    }

    /**
     * HTTP client ber-Bearer API key. IPv4 dipaksa seperti versi api-getskill (CURL_IPRESOLVE_V4)
     * karena whitelist IP Tripay berbasis IPv4.
     *
     * @return PendingRequest
     */
    private function http(): PendingRequest
    {
        return Http::withToken((string) config('tripay.api_key'))
            ->acceptJson()
            ->timeout(20)
            ->withOptions(['force_ip_resolve' => 'v4']);
    }

    /**
     * Gabungkan api_url dengan path endpoint.
     *
     * @param  string  $path
     * @return string
     */
    private function url(string $path): string
    {
        return rtrim((string) config('tripay.api_url'), '/').'/'.$path;
    }
}
