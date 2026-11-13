<?php

namespace App\Helpers;

use App\Enums\RoleEnum;
use App\Models\User;

/**
 * Halaman awal staf Bank Mini sesuai role: wali kelas ke dasbor kelasnya, petugas ke monitoring.
 */
class BankMiniBeranda
{
    /**
     * URL beranda staf.
     *
     * @param  ?User  $user
     * @return string
     */
    public static function staf(?User $user): string
    {
        return $user?->role === RoleEnum::WALI_KELAS->value
            ? route('bank-mini.walas.dashboard')
            : route('bank-mini.admin.monitoring');
    }

    /**
     * URL halaman login staf sesuai role.
     *
     * @param  ?User  $user
     * @return string
     */
    public static function loginStaf(?User $user): string
    {
        return $user?->role === RoleEnum::WALI_KELAS->value
            ? route('bank-mini.walas.login')
            : route('bank-mini.admin.login');
    }
}
