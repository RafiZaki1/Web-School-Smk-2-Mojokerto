<?php

namespace App\Enums;

use App\Enums\Concerns\HasLabels;
use App\Enums\Concerns\HasValues;

enum AdministrationStatusEnum: string
{
    use HasLabels, HasValues;

    case CLEARED = 'cleared';
    case PENDING = 'pending';

    public function label(): string
    {
        return match ($this) {
            self::CLEARED => 'Beres',
            self::PENDING => 'Belum',
        };
    }
}
