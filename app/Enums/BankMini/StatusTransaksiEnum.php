<?php

namespace App\Enums\BankMini;

use App\Enums\Concerns\HasValues;

enum StatusTransaksiEnum: string
{
    use HasValues;

    case PENDING = 'pending';

    case SETTLEMENT = 'settlement';
    case EXPIRED = 'expired';
    case FAILED = 'failed';

    /** Dibatalkan admin: transaksi yang belum dibayar, atau pelunasan yang dicabut. */
    case CANCELED = 'canceled';

    /**
     * Label status untuk antarmuka.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu Pembayaran',
            self::SETTLEMENT => 'Berhasil',
            self::EXPIRED => 'Kedaluwarsa',
            self::FAILED => 'Gagal',
            self::CANCELED => 'Dibatalkan',
        };
    }

    /**
     * Petakan status Tripay (callback maupun transaction/detail) ke status lokal.
     *
     * @param  string  $status  UNPAID, PAID, EXPIRED, FAILED, atau REFUND
     * @return self
     */
    public static function fromTripay(string $status): self
    {
        return match (strtoupper($status)) {
            'PAID' => self::SETTLEMENT,
            'UNPAID' => self::PENDING,
            'EXPIRED' => self::EXPIRED,
            default => self::FAILED,
        };
    }
}
