<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    /** Kunci konten yang dikenali FE (halaman /bkk, /spmb, /produk, /sejarah, /fasilitas, kontak & mitra). */
    public const KEYS = ['bkk', 'spmb', 'produk', 'sejarah', 'fasilitas', 'kontak', 'mitra'];

    protected $fillable = [
        'key',
        'value',
    ];

    protected $casts = [
        'value' => 'array',
    ];
}
