<?php

namespace App\Enums;

enum RoleEnum: string
{
    case ADMIN = 'admin';

    /** Satu akun bersama Tata Usaha, boleh login di banyak perangkat sekaligus. */
    case ADMIN_TU = 'admin_tu';

    /** Petugas loket Bank Mini: kelola tagihan, bayar tunai, laporan kas, dan akun wali kelas. */
    case PETUGAS_BANK_MINI = 'petugas_bank_mini';

    /** Wali kelas: hanya bisa memantau pembayaran SPP kelasnya di portal Bank Mini. */
    case WALI_KELAS = 'wali_kelas';
}
