<?php

namespace App\Enums\BankMini;

use App\Enums\Concerns\HasValues;

/**
 * Kendali manual petugas/admin atas satu transaksi di halaman Pembayaran Masuk.
 * Petugas hanya menyetujui manual transaksi yang belum lunas; admin boleh mengubah
 * transaksi di tahap mana pun.
 */
enum AksiVerifikasiEnum: string
{
    use HasValues;

    case SETUJUI = 'setujui';
    case BATALKAN = 'batalkan';

    /**
     * Status transaksi setelah aksi dijalankan.
     *
     * @return StatusTransaksiEnum
     */
    public function tujuan(): StatusTransaksiEnum
    {
        return match ($this) {
            self::SETUJUI => StatusTransaksiEnum::SETTLEMENT,
            self::BATALKAN => StatusTransaksiEnum::CANCELED,
        };
    }

    /**
     * Status transaksi yang boleh dikenai aksi ini. Array kosong berarti role tidak berhak.
     *
     * @param  bool  $admin  true untuk role admin (kendali penuh)
     * @return array<int, StatusTransaksiEnum>
     */
    public function statusAsal(bool $admin): array
    {
        return match ($this) {
            self::SETUJUI => $admin
                ? [StatusTransaksiEnum::PENDING, StatusTransaksiEnum::EXPIRED, StatusTransaksiEnum::FAILED, StatusTransaksiEnum::CANCELED]
                : [StatusTransaksiEnum::PENDING, StatusTransaksiEnum::EXPIRED, StatusTransaksiEnum::FAILED],
            self::BATALKAN => $admin ? [StatusTransaksiEnum::PENDING, StatusTransaksiEnum::SETTLEMENT] : [],
        };
    }

    /**
     * Status tagihan bulan yang ikut berubah, tergantung status transaksi sebelum aksi.
     *
     * @param  StatusTransaksiEnum  $sebelum
     * @return array<int, StatusTagihanEnum>
     */
    public function tagihanAsal(StatusTransaksiEnum $sebelum): array
    {
        return match (true) {
            $this === self::SETUJUI => [StatusTagihanEnum::PENDING, StatusTagihanEnum::BELUM_LUNAS],
            $sebelum === StatusTransaksiEnum::SETTLEMENT => [StatusTagihanEnum::LUNAS],
            default => [StatusTagihanEnum::PENDING],
        };
    }

    /**
     * Status tagihan bulan setelah aksi.
     *
     * @return StatusTagihanEnum
     */
    public function tagihanTujuan(): StatusTagihanEnum
    {
        return $this === self::SETUJUI ? StatusTagihanEnum::LUNAS : StatusTagihanEnum::BELUM_LUNAS;
    }

    /**
     * Kunci pesan sukses di lang/alert.php.
     *
     * @return string
     */
    public function pesan(): string
    {
        return match ($this) {
            self::SETUJUI => 'alert.spp_payment_approved',
            self::BATALKAN => 'alert.spp_payment_canceled',
        };
    }
}
