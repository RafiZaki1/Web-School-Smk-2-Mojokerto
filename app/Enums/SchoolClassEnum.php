<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * 12 kelas XII. Nilai enum sama persis dengan teks kelas di file Excel.
 */
enum SchoolClassEnum: string
{
    use HasValues;

    case RPL_1 = 'XII RPL 1';
    case RPL_2 = 'XII RPL 2';
    case RPL_3 = 'XII RPL 3';
    case LPS_1 = 'XII LPS 1';
    case LPS_2 = 'XII LPS 2';
    case DKV_1 = 'XII DKV 1';
    case DKV_2 = 'XII DKV 2';
    case APHP_1 = 'XII APHP 1';
    case APHP_2 = 'XII APHP 2';
    case KULINER_1 = 'XII Kuliner 1';
    case KULINER_2 = 'XII Kuliner 2';
    case KULINER_3 = 'XII Kuliner 3';

    public function major(): MajorCodeEnum
    {
        return MajorCodeEnum::from(strtoupper(explode(' ', $this->value)[1]));
    }

    /**
     * Cocokkan teks kelas dari input bebas, mis. "xii rpl 1" atau "XII  KULINER 2".
     */
    public static function fromInput(?string $input): ?self
    {
        $normalized = mb_strtolower((string) preg_replace('/\s+/', ' ', trim((string) $input)));

        foreach (self::cases() as $case) {
            if ($normalized === mb_strtolower($case->value)) {
                return $case;
            }
        }

        return null;
    }
}
