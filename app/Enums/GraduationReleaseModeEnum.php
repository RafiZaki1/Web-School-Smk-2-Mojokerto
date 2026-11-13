<?php

namespace App\Enums;

use App\Enums\Concerns\HasLabels;
use App\Enums\Concerns\HasValues;

enum GraduationReleaseModeEnum: string
{
    use HasLabels, HasValues;

    case DRAFT = 'draft';
    case TIMER = 'timer';
    case OPEN = 'open';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft / Sembunyikan',
            self::TIMER => 'Gunakan Timer',
            self::OPEN => 'Buka Langsung',
        };
    }
}
