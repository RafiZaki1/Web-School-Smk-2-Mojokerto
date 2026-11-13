<?php

namespace App\Enums;

use App\Enums\Concerns\HasLabels;
use App\Enums\Concerns\HasValues;

enum GraduationStatusEnum: string
{
    use HasLabels, HasValues;

    case PASSED = 'passed';
    case DEFERRED = 'deferred';

    public function label(): string
    {
        return match ($this) {
            self::PASSED => 'Lulus',
            self::DEFERRED => 'Ditunda',
        };
    }
}
