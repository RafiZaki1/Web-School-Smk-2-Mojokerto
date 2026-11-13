<?php

namespace App\Enums\BankMini;

use App\Enums\Concerns\HasValues;

enum MetodeBayarEnum: string
{
    use HasValues;

    case TUNAI = 'tunai';
    case GATEWAY = 'gateway';

    /**
     * Label metode untuk antarmuka.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::TUNAI => 'Tunai di Bank Mini',
            self::GATEWAY => 'Payment Gateway',
        };
    }
}
