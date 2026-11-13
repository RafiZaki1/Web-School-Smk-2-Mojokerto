<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum SchoolEventCategoryEnum: string
{
    use HasValues;

    case AKADEMIK = 'Akademik';
    case KESISWAAN = 'Kesiswaan';
    case SPMB = 'SPMB';
    case HARI_BESAR = 'Hari Besar';
    case UMUM = 'Umum';
}
