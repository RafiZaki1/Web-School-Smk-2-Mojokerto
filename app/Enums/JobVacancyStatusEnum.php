<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum JobVacancyStatusEnum: string
{
    use HasValues;

    case OPEN = 'open';
    case CLOSED = 'closed';
}
