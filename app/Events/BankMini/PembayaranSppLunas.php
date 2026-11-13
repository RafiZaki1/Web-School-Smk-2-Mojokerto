<?php

namespace App\Events\BankMini;

use Illuminate\Foundation\Events\Dispatchable;

/**
 * Pembayaran SPP lewat Tripay baru saja berubah menjadi settlement.
 * Didispatch setelah DB::commit() dan hanya sekali per transaksi, karena perubahan
 * status memakai UPDATE bersyarat (lihat MenerapkanStatusGateway).
 */
class PembayaranSppLunas
{
    use Dispatchable;

    /**
     * Buat event untuk satu transaksi yang lunas.
     *
     * @param  string  $orderId
     */
    public function __construct(public string $orderId) {}
}
