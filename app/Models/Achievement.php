<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'card_title',
        'rank',
        'level',
        'category',
        'subtitle',
        'student_name',
        'student_class',
        'student_photo',
        'cover_image',
        'start_date',
        'end_date',
        'location',
        'organizer',
        'summary',
        'description',
        'document',
        'testimonial',
        'gallery_title',
        'gallery_description',
        'gallery',
        'is_published',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'testimonial' => 'array',
        'gallery' => 'array',
        'is_published' => 'boolean',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('start_date')->orderByDesc('id');
    }
}
