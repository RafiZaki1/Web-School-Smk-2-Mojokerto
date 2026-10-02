<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    public const CATEGORIES = ['Informasi umum', 'Prestasi', 'Agenda sekolah', 'Pengumuman', 'Karya siswa'];

    protected $fillable = [
        'slug',
        'title',
        'category',
        'author',
        'published_at',
        'cover_image',
        'body',
        'gallery',
        'is_published',
    ];

    protected $casts = [
        'published_at' => 'date',
        'gallery' => 'array',
        'is_published' => 'boolean',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('published_at')->orderByDesc('id');
    }
}
