<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    use HasFactory;

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

    protected $casts = [
        'competencies' => 'array',
        'careers' => 'array',
        'facilities' => 'array',
        'partners' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
