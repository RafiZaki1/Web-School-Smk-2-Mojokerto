<?php

namespace App\Enums;

use App\Enums\Concerns\HasLabels;
use App\Enums\Concerns\HasValues;

enum AlumniServiceTypeEnum: string
{
    use HasLabels, HasValues;

    case DIPLOMA_PICKUP = 'diploma_pickup';
    case FINGERPRINT = 'fingerprint';
    case LEGALIZATION = 'legalization';

    public function label(): string
    {
        return match ($this) {
            self::DIPLOMA_PICKUP => 'Ambil Ijazah',
            self::FINGERPRINT => 'Cap Tiga Jari',
            self::LEGALIZATION => 'Legalisir',
        };
    }
}
