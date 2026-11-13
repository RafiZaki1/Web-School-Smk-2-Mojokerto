<?php

namespace App\Enums;

use App\Enums\Concerns\HasLabels;
use App\Enums\Concerns\HasValues;

enum AlumniServiceStatusEnum: string
{
    use HasLabels, HasValues;

    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case COMPLETED = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu',
            self::PROCESSING => 'Diproses',
            self::APPROVED => 'Disetujui',
            self::REJECTED => 'Ditolak',
            self::COMPLETED => 'Selesai',
        };
    }
}
