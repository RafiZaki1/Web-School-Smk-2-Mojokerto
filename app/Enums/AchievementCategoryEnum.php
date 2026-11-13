<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum AchievementCategoryEnum: string
{
    use HasValues;

    case AKADEMIK = 'Akademik';
    case NON_AKADEMIK = 'Non-akademik';
    case OLAHRAGA = 'Olahraga';
    case SENI = 'Seni';
}
