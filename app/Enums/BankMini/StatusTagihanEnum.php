<?php

namespace App\Enums\BankMini;

use App\Enums\Concerns\HasValues;

enum StatusTagihanEnum: string
{
    use HasValues;

    case BELUM_LUNAS = 'belum_lunas';
    case PENDING = 'pending';
    case LUNAS = 'lunas';
}
