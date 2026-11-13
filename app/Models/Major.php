<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'slug',
        'code',
        'name',
        'tagline',
        'accreditation',
        'summary',
        'description',
        'image',
        'accent_color',
        'competencies',
        'careers',
        'facility_title',
        'facilities',
        'partners',
        'lab_room_slug',
        'is_published',
        'sort_order',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'competencies' => 'array',
        'careers' => 'array',
        'facilities' => 'array',
        'partners' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Batasi query hanya pada jurusan yang diterbitkan.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * Urutkan jurusan berdasarkan urutan tampil, lalu id.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
