<?php

namespace App\Helpers;

use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

class AcademicYearHelper
{
    /**
     * Tahun lulus angkatan kelas XII saat ini. Tahun ajaran berganti bulan Juli,
     * jadi November 2026 berarti angkatan yang lulus tahun 2027.
     *
     * @param  ?CarbonInterface  $now
     * @return int
     */
    public static function graduationYear(?CarbonInterface $now = null): int
    {
        $now ??= Carbon::now();

        return $now->month >= 7 ? $now->year + 1 : $now->year;
    }

    /**
     * Label tahun ajaran berjalan, mis. "2026/2027" untuk November 2026.
     *
     * @param  ?CarbonInterface  $now
     * @return string
     */
    public static function current(?CarbonInterface $now = null): string
    {
        $end = self::graduationYear($now);

        return ($end - 1).'/'.$end;
    }

    /**
     * Pastikan teks berformat "YYYY/YYYY" dengan tahun berurutan.
     *
     * @param  ?string  $value
     * @return bool
     */
    public static function isValid(?string $value): bool
    {
        if (! is_string($value) || ! preg_match('/^(\d{4})\/(\d{4})$/', $value, $m)) {
            return false;
        }

        return (int) $m[2] === (int) $m[1] + 1;
    }
}
