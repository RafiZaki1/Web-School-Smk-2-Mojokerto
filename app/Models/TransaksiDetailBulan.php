<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransaksiDetailBulan extends Model
{
    protected $table = 'transaksi_detail_bulan';

    /** @var array<int, string> */
    protected $fillable = [
        'transaksi_id',
        'tagihan_spp_id',
        'nominal_spp',
        'nominal_tabungan',
    ];

    /**
     * Atribut yang di-cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'nominal_spp' => 'integer',
            'nominal_tabungan' => 'integer',
        ];
    }

    /**
     * Transaksi induk.
     *
     * @return BelongsTo
     */
    public function transaksi(): BelongsTo
    {
        return $this->belongsTo(TransaksiBankMini::class, 'transaksi_id');
    }

    /**
     * Tagihan bulan yang dibayar.
     *
     * @return BelongsTo
     */
    public function tagihan(): BelongsTo
    {
        return $this->belongsTo(TagihanSpp::class, 'tagihan_spp_id');
    }
}
