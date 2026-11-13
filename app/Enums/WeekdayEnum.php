<?php

namespace App\Enums;

use App\Enums\Concerns\HasLabels;
use App\Enums\Concerns\HasValues;

enum WeekdayEnum: string
{
    use HasLabels, HasValues;

    case MONDAY = 'monday';
    case TUESDAY = 'tuesday';
    case WEDNESDAY = 'wednesday';
    case THURSDAY = 'thursday';
    case FRIDAY = 'friday';

    public function label(): string
    {
        return match ($this) {
            self::MONDAY => 'Senin',
            self::TUESDAY => 'Selasa',
            self::WEDNESDAY => 'Rabu',
            self::THURSDAY => 'Kamis',
            self::FRIDAY => 'Jumat',
        };
    }

    /**
     * Urutan hari, Senin = 1.
     */
    public function order(): int
    {
        return array_search($this, self::cases(), true) + 1;
    }
}
