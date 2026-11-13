<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum SiteContentKeyEnum: string
{
    use HasValues;

    case BKK = 'bkk';
    case SPMB = 'spmb';
    case PRODUK = 'produk';
    case SEJARAH = 'sejarah';
    case FASILITAS = 'fasilitas';
    case KONTAK = 'kontak';
    case MITRA = 'mitra';
    case SAMBUTAN = 'sambutan';
}
