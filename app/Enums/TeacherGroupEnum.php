<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum TeacherGroupEnum: string
{
    use HasValues;

    case PIMPINAN = 'pimpinan';
    case GURU = 'guru';
    case TENDIK = 'tendik';

    /**
     * Label kelompok yang tampil di halaman publik.
     */
    public function label(): string
    {
        return match ($this) {
            self::PIMPINAN => 'Pimpinan Sekolah',
            self::GURU => 'Guru',
            self::TENDIK => 'Tenaga Kependidikan',
        };
    }

    /**
     * Pilihan kelompok sebagai peta nilai ke label, dipakai untuk filter di halaman publik.
     *
     * @return array<string, string>
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $group) => [$group->value => $group->label()])
            ->all();
    }
}
