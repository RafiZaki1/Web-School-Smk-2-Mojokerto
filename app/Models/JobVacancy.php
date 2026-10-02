<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobVacancy extends Model
{
    use HasFactory;

    public const CATEGORIES = ['Perbankan', 'IT & Teknologi', 'Kuliner & Hospitality', 'Desain & Kreatif', 'Manufaktur'];

    public const TYPES = ['Full-time', 'Part-time', 'Magang', 'Kontrak'];

    public const STATUS_OPEN = 'open';

    public const STATUS_CLOSED = 'closed';

    protected $fillable = [
        'slug',
        'title',
        'company',
        'location',
        'category',
        'employment_type',
        'closes_at',
        'status',
        'poster',
        'banner_color',
        'banner_headline',
        'banner_subtitle',
        'description',
        'responsibilities',
        'qualifications',
        'contact_phone',
        'contact_email',
    ];

    protected $casts = [
        'closes_at' => 'date',
        'responsibilities' => 'array',
        'qualifications' => 'array',
    ];

    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_OPEN);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByRaw('closes_at is null')->orderBy('closes_at')->orderByDesc('id');
    }
}
