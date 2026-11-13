<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    /** @var array<int, string> */
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

    /** @var array<string, string> */
    protected $casts = [
        'published_at' => 'date',
        'gallery' => 'array',
        'is_published' => 'boolean',
    ];

    /**
     * Batasi query hanya pada berita yang diterbitkan.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * Urutkan berita dari tanggal terbit terbaru.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('published_at')->orderByDesc('id');
    }
}
