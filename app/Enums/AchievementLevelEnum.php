<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum AchievementLevelEnum: string
{
    use HasValues;

    case LOKAL = 'Lokal';
    case REGIONAL = 'Regional';
    case PROVINSI = 'Provinsi';
    case NASIONAL = 'Nasional';
    case INTERNASIONAL = 'Internasional';
}
