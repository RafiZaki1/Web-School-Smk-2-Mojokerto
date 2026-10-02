<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Extracurricular extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'tagline',
        'icon',
        'cover_image',
        'summary',
        'schedule',
        'location',
        'members',
        'about_title',
        'about',
        'gallery_title',
        'gallery',
        'achievements',
        'testimonials',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'gallery' => 'array',
        'achievements' => 'array',
        'testimonials' => 'array',
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
