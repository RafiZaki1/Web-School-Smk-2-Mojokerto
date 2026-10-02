<?php

namespace App\Helpers;

use Carbon\CarbonInterface;

/**
 * Label tanggal berbahasa Indonesia seperti yang ditampilkan FE:
 * "19 Juli 2026", "30 Sep 2026", "April 2026", "12 - 15 Juni 2026".
 */
class DateLabel
{
    public static function long(?CarbonInterface $date): ?string
    {
        return $date?->locale('id')->translatedFormat('j F Y');
    }

    public static function short(?CarbonInterface $date): ?string
    {
        return $date?->locale('id')->translatedFormat('j M Y');
    }

    public static function monthYear(?CarbonInterface $date): ?string
    {
        return $date?->locale('id')->translatedFormat('F Y');
    }

    public static function range(?CarbonInterface $start, ?CarbonInterface $end): ?string
    {
        if (! $start) {
            return self::long($end);
        }

        if (! $end || $start->isSameDay($end)) {
            return self::long($start);
        }

        if ($start->isSameMonth($end)) {
            return $start->format('j').' - '.self::long($end);
        }

        if ($start->isSameYear($end)) {
            return $start->locale('id')->translatedFormat('j F').' - '.self::long($end);
        }

        return self::long($start).' - '.self::long($end);
    }
}
