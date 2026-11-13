<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Notifikasi pembayaran online yang masuk ke panel petugas Bank Mini.
 */
class NotifikasiBankMini extends Model
{
    protected $table = 'notifikasi_bank_mini';

    /** @var array<int, string> */
    protected $fillable = [
        'transaksi_id',
        'judul',
        'pesan',
        'dibaca_at',
    ];

    /**
     * Atribut yang di-cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'dibaca_at' => 'datetime',
        ];
    }

    /**
     * Transaksi pembayaran yang dikabarkan.
     *
     * @return BelongsTo
     */
    public function transaksi(): BelongsTo
    {
        return $this->belongsTo(TransaksiBankMini::class, 'transaksi_id');
    }
}
