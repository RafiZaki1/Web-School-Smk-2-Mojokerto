<?php

namespace App\Http\Resources;

use App\Helpers\BankMiniFormat;
use App\Models\NotifikasiBankMini;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin NotifikasiBankMini
 */
class NotifikasiBankMiniResource extends JsonResource
{
    /**
     * Ubah notifikasi menjadi array untuk lonceng panel petugas.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $orderId = $this->transaksi?->order_id;

        return [
            'id' => $this->id,
            'judul' => $this->judul,
            'pesan' => $this->pesan,
            'dibaca' => $this->dibaca_at !== null,
            'waktu' => BankMiniFormat::tanggal($this->created_at, true),
            'url' => $orderId ? route('bank-mini.admin.pembayaran', ['q' => $orderId]) : null,
        ];
    }
}
