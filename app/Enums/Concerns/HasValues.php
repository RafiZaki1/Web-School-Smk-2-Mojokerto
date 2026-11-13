<?php

namespace App\Enums\Concerns;

trait HasValues
{
    /**
     * Ambil seluruh nilai backed enum dalam bentuk daftar.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
