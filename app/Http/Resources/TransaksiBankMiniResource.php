<?php

namespace App\Http\Resources;

use App\Models\TagihanSpp;
use App\Models\TransaksiBankMini;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TransaksiBankMini
 */
class TransaksiBankMiniResource extends JsonResource
{
    /**
     * Ubah transaksi Bank Mini menjadi array respons. Kode bayar hanya dikirim saat transaksi masih bisa dilanjutkan.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'order_id' => $this->order_id,
            'metode' => $this->metode->value,
            'metode_label' => $this->metode->label(),
            'reference' => $this->reference,
            'channel' => $this->channel,
            'channel_nama' => $this->channel_nama,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'total_nominal' => $this->total_nominal,
            'porsi_spp' => $this->porsi_spp,
            'porsi_tabungan' => $this->porsi_tabungan,
            'biaya_admin' => $this->biaya_admin,
            'total_bayar' => $this->totalBayar(),
            'pay_code' => $this->when($this->bisaDilanjutkan(), $this->pay_code),
            'checkout_url' => $this->when($this->bisaDilanjutkan(), $this->checkout_url),
            'detail_url' => $this->when(! $request->routeIs('bank-mini.admin.*'), fn () => route('bank-mini.transaksi.show', $this->order_id)),
            'expires_at' => $this->expires_at?->toIso8601String(),
            'paid_at' => $this->paid_at?->toIso8601String(),
            'catatan_verifikasi' => $this->catatan_verifikasi,
            'diverifikasi_at' => $this->diverifikasi_at?->toIso8601String(),
            'bulan' => $this->whenLoaded('tagihan', fn () => $this->tagihan->map(fn (TagihanSpp $tagihan) => [
                'id' => $tagihan->id,
                'label' => $tagihan->labelBulan(),
            ])->values()),
            'kwitansi_url' => $this->when($this->isSettlement(), fn () => route(
                $request->routeIs('bank-mini.admin.*') ? 'bank-mini.admin.kwitansi' : 'bank-mini.kwitansi',
                $this->order_id,
            )),
        ];
    }
}
