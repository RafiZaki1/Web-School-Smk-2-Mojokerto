<?php

namespace App\Enums\BankMini;

use App\Enums\Concerns\HasValues;

/**
 * Halaman panel Bank Mini yang bisa dibuka langsung dari Panel Admin utama.
 */
enum TujuanPanelEnum: string
{
    use HasValues;

    case MONITORING = 'monitoring';
    case PEMBAYARAN = 'pembayaran';
    case LAPORAN = 'laporan';
    case TAGIHAN = 'tagihan';
    case WALI_KELAS = 'wali-kelas';
    case LAYANAN = 'layanan';

    /**
     * Nama route halaman tujuan di routes/bank-mini.php.
     *
     * @return string
     */
    public function namaRoute(): string
    {
        return 'bank-mini.admin.'.$this->value;
    }
}
