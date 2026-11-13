<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum JobEmploymentTypeEnum: string
{
    use HasValues;

    case FULL_TIME = 'Full-time';
    case PART_TIME = 'Part-time';
    case MAGANG = 'Magang';
    case KONTRAK = 'Kontrak';
}
