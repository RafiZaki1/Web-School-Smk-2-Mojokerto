<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum PortalLinkKeyEnum: string
{
    use HasValues;

    case ELEARNING = 'elearning';
}
