<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum AchievementRankEnum: string
{
    use HasValues;

    case JUARA_1 = 'Juara 1';
    case JUARA_2 = 'Juara 2';
    case JUARA_3 = 'Juara 3';
    case MEDALI = 'Medali';
    case HARAPAN = 'Harapan';
}
