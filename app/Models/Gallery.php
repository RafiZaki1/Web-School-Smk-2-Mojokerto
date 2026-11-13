<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'title',
        'image',
        'category',
        'is_active',
        'sort_order',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Batasi query hanya pada foto galeri yang aktif.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Urutkan galeri berdasarkan urutan tampil, lalu id terbaru.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('id', 'desc');
    }

    /**
     * Saring galeri berdasarkan kategori bila kategori diisi.
     */
    public function scopeCategory(Builder $query, ?string $category): Builder
    {
        return $category ? $query->where('category', $category) : $query;
    }
}
