<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum DocumentCategoryEnum: string
{
    use HasValues;

    case SPMB = 'SPMB';
    case KURIKULUM = 'Kurikulum';
    case KESISWAAN = 'Kesiswaan';
    case FORMULIR = 'Formulir';
    case UMUM = 'Umum';
}
