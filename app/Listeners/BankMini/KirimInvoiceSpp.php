<?php

namespace App\Listeners\BankMini;

use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Events\BankMini\PembayaranSppLunas;
use App\Mail\InvoiceSppMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

/**
 * Kirim invoice lunas ke email yang diisi siswa saat checkout. Lewat queue supaya
 * callback Tripay tidak menunggu SMTP; butuh `php artisan queue:work` berjalan.
 */
class KirimInvoiceSpp implements ShouldQueue
{
    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [30, 120];

    /**
     * Inisialisasi listener dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     */
    public function __construct(
        protected TransaksiBankMiniRepositoryInterface $transaksi,
    ) {}

    /**
     * Kirim email invoice. Transaksi tanpa email (data lama) dilewati.
     *
     * @param  PembayaranSppLunas  $event
     * @return void
     */
    public function handle(PembayaranSppLunas $event): void
    {
        $transaksi = $this->transaksi->detailOrFail($event->orderId);

        if (blank($transaksi->email_invoice) || ! $transaksi->isSettlement()) {
            return;
        }

        Mail::to($transaksi->email_invoice, $transaksi->siswa?->nama)->send(new InvoiceSppMail($transaksi));
    }
}
