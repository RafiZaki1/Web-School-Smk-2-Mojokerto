<?php

namespace App\Enums\BankMini;

use App\Enums\Concerns\HasValues;

/**
 * Filter status pembayaran sampai bulan berjalan: lunas = semua bulan yang sudah
 * jatuh tempo sudah dibayar; bulan yang belum jatuh tempo tidak dihitung.
 */
enum StatusLunasFilterEnum: string
{
    use HasValues;

    case LUNAS = 'lunas';
    case BELUM = 'belum';

    /**
     * Label filter untuk antarmuka.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::LUNAS => 'Sudah lunas',
            self::BELUM => 'Belum lunas',
        };
    }
}
