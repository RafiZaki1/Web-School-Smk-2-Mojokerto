<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternshipDocumentation extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'title',
        'description',
        'image',
        'major_code',
        'industry_partner_id',
        'activity_date',
        'is_published',
        'sort_order',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'activity_date' => 'date:Y-m-d',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function industryPartner(): BelongsTo
    {
        return $this->belongsTo(IndustryPartner::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeForMajor(Builder $query, ?string $majorCode): Builder
    {
        return $majorCode ? $query->where('major_code', $majorCode) : $query;
    }

    /**
     * Urutan tampil, lalu kegiatan terbaru.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('activity_date')->orderByDesc('id');
    }
}
