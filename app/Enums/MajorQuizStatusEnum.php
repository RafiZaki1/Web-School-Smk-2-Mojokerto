<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum MajorQuizStatusEnum: string
{
    use HasValues;

    case NEW = 'new';
    case REVIEWED = 'reviewed';
}
