<?php

namespace App\Models;

use App\Enums\JobVacancyStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobVacancy extends Model
{
    use HasFactory;

    /** @var array<int, string> */
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

    /** @var array<string, string> */
    protected $casts = [
        'closes_at' => 'date',
        'responsibilities' => 'array',
        'qualifications' => 'array',
    ];

    /**
     * Batasi query hanya pada lowongan yang masih dibuka.
     */
    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', JobVacancyStatusEnum::OPEN->value);
    }

    /**
     * Urutkan lowongan berdasarkan tanggal tutup terdekat, lalu id terbaru.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByRaw('closes_at is null')->orderBy('closes_at')->orderByDesc('id');
    }
}
