<?php

namespace App\Listeners\BankMini;

use App\Contracts\Interfaces\NotifikasiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Events\BankMini\PembayaranSppLunas;
use App\Helpers\BankMiniFormat;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Masukkan pembayaran online yang lunas ke kotak notifikasi panel petugas Bank Mini.
 * Dijalankan sinkron supaya notifikasi langsung muncul walau queue worker mati; galat hanya
 * dicatat ke log agar respons callback Tripay tetap sukses (tagihan sudah terlanjur lunas).
 */
class CatatNotifikasiPetugas
{
    /**
     * Inisialisasi listener dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     * @param  NotifikasiBankMiniRepositoryInterface  $notifikasi
     */
    public function __construct(
        protected TransaksiBankMiniRepositoryInterface $transaksi,
        protected NotifikasiBankMiniRepositoryInterface $notifikasi,
    ) {}

    /**
     * Susun judul dan pesan notifikasi dari transaksi lalu simpan.
     *
     * @param  PembayaranSppLunas  $event
     * @return void
     */
    public function handle(PembayaranSppLunas $event): void
    {
        try {
            $transaksi = $this->transaksi->detailOrFail($event->orderId);
            $siswa = $transaksi->siswa;
            $jumlahBulan = $transaksi->tagihan->count();

            $this->notifikasi->catat(
                $transaksi->id,
                'Pembayaran online masuk '.BankMiniFormat::rupiah($transaksi->total_nominal),
                sprintf(
                    '%s (%s) melunasi %d bulan: %s%s.',
                    $siswa?->nama ?? 'Siswa',
                    $siswa?->kelas ?? '-',
                    $jumlahBulan,
                    $transaksi->ringkasanBulan(),
                    $transaksi->channel_nama ? ' via '.$transaksi->channel_nama : '',
                ),
            );
        } catch (Throwable $th) {
            Log::error('Bank Mini: gagal mencatat notifikasi petugas.', ['order_id' => $event->orderId, 'error' => $th->getMessage()]);
        }
    }
}
