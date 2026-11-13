<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Berkas unduhan publik (halaman /unduhan).
 */
class Document extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'slug',
        'title',
        'category',
        'description',
        'file',
        'file_size',
        'file_type',
        'download_count',
        'is_published',
        'sort_order',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'file_size' => 'integer',
        'download_count' => 'integer',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Batasi query hanya pada berkas yang diterbitkan.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * Urutkan berkas berdasarkan urutan tampil, lalu pembaruan terakhir.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('updated_at')->orderByDesc('id');
    }
}
