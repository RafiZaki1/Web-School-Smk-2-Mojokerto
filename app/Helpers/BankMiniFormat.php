<?php

namespace App\Helpers;

use Carbon\CarbonInterface;

/**
 * Format tampilan modul Bank Mini: rupiah dan tanggal WIB.
 */
class BankMiniFormat
{
    /**
     * Format angka ke rupiah, mis. 225000 -> "Rp 225.000".
     *
     * @param  int|float|null  $nominal
     * @return string
     */
    public static function rupiah(int|float|null $nominal): string
    {
        return 'Rp '.number_format((float) $nominal, 0, ',', '.');
    }

    /**
     * Format tanggal di zona WIB, mis. "13 Nov 2026" atau "13 Nov 2026, 14.05".
     *
     * @param  ?CarbonInterface  $waktu
     * @param  bool  $denganJam
     * @return string
     */
    public static function tanggal(?CarbonInterface $waktu, bool $denganJam = false): string
    {
        if ($waktu === null) {
            return '-';
        }

        return $waktu->copy()->timezone('Asia/Jakarta')->locale('id')->translatedFormat($denganJam ? 'j M Y, H.i' : 'j M Y');
    }

    /**
     * Tanggal hari ini lengkap untuk subjudul halaman, mis. "Jumat, 13 November 2026".
     *
     * @return string
     */
    public static function hariIni(): string
    {
        return now('Asia/Jakarta')->locale('id')->translatedFormat('l, j F Y');
    }
}
