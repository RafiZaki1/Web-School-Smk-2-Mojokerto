<?php

namespace App\Enums;

use App\Enums\Concerns\HasLabels;
use App\Enums\Concerns\HasValues;

enum GuestMessageStatusEnum: string
{
    use HasLabels, HasValues;

    case NEW = 'new';
    case READ = 'read';
    case REPLIED = 'replied';

    public function label(): string
    {
        return match ($this) {
            self::NEW => 'Baru',
            self::READ => 'Dibaca',
            self::REPLIED => 'Dibalas',
        };
    }
}
