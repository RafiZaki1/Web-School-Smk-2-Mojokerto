<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Agenda sekolah (halaman /agenda).
 */
class SchoolEvent extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'slug',
        'title',
        'category',
        'description',
        'location',
        'starts_on',
        'ends_on',
        'time_label',
        'cover_image',
        'is_published',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'starts_on' => 'date',
        'ends_on' => 'date',
        'is_published' => 'boolean',
    ];

    /**
     * Batasi query hanya pada agenda yang diterbitkan.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * Batasi query pada agenda yang belum selesai, yaitu berlangsung hari ini atau nanti.
     */
    public function scopeUpcoming(Builder $query): Builder
    {
        $today = now()->toDateString();

        return $query->where(fn (Builder $q) => $q
            ->whereDate('starts_on', '>=', $today)
            ->orWhereDate('ends_on', '>=', $today));
    }

    /**
     * Batasi query pada agenda yang sudah selesai.
     */
    public function scopePast(Builder $query): Builder
    {
        $today = now()->toDateString();

        return $query
            ->whereDate('starts_on', '<', $today)
            ->where(fn (Builder $q) => $q->whereNull('ends_on')->orWhereDate('ends_on', '<', $today));
    }

    /**
     * Urutkan agenda dari tanggal mulai terbaru.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('starts_on')->orderByDesc('id');
    }

    /**
     * Periksa apakah agenda sedang berlangsung hari ini.
     */
    public function isOngoing(): bool
    {
        $today = now()->startOfDay();

        return $this->starts_on->lte($today) && ($this->ends_on ?? $this->starts_on)->gte($today);
    }
}
