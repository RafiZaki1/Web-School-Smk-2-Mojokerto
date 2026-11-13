<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum JobCategoryEnum: string
{
    use HasValues;

    case PERBANKAN = 'Perbankan';
    case IT_TEKNOLOGI = 'IT & Teknologi';
    case KULINER_HOSPITALITY = 'Kuliner & Hospitality';
    case DESAIN_KREATIF = 'Desain & Kreatif';
    case MANUFAKTUR = 'Manufaktur';
}
