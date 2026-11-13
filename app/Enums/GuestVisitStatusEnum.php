<?php

namespace App\Enums;

use App\Enums\Concerns\HasLabels;
use App\Enums\Concerns\HasValues;

enum GuestVisitStatusEnum: string
{
    use HasLabels, HasValues;

    case SCHEDULED = 'scheduled';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::SCHEDULED => 'Dijadwalkan',
            self::COMPLETED => 'Selesai',
            self::CANCELLED => 'Batal',
        };
    }
}
