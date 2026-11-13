<?php

namespace App\Enums;

use App\Enums\Concerns\HasLabels;
use App\Enums\Concerns\HasValues;

/**
 * Kode 5 jurusan untuk modul TU. Tabel majors memakai kode "Tata Boga" untuk Kuliner;
 * modul TU memakai KULINER agar sama dengan nama kelas dan MitraList.
 */
enum MajorCodeEnum: string
{
    use HasLabels, HasValues;

    case RPL = 'RPL';
    case LPS = 'LPS';
    case DKV = 'DKV';
    case APHP = 'APHP';
    case KULINER = 'KULINER';

    public function label(): string
    {
        return match ($this) {
            self::RPL => 'Rekayasa Perangkat Lunak',
            self::LPS => 'Layanan Perbankan Syariah',
            self::DKV => 'Desain Komunikasi Visual',
            self::APHP => 'Agribisnis Pengolahan Hasil Pertanian',
            self::KULINER => 'Kuliner',
        };
    }

    /**
     * Kelas XII milik jurusan ini.
     *
     * @return array<int, SchoolClassEnum>
     */
    public function classes(): array
    {
        return array_values(array_filter(
            SchoolClassEnum::cases(),
            fn (SchoolClassEnum $class) => $class->major() === $this,
        ));
    }
}
