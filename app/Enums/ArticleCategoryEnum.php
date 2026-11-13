<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum ArticleCategoryEnum: string
{
    use HasValues;

    case INFORMASI_UMUM = 'Informasi umum';
    case PRESTASI = 'Prestasi';
    case AGENDA_SEKOLAH = 'Agenda sekolah';
    case PENGUMUMAN = 'Pengumuman';
    case KARYA_SISWA = 'Karya siswa';
}
