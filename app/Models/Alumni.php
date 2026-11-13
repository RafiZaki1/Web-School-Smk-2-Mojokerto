<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    use HasFactory;

    /** @var string */
    protected $table = 'alumni';

    /** @var array<int, string> */
    protected $fillable = [
        'name',
        'major_code',
        'graduation_year',
        'career',
        'work_location',
        'testimonial',
        'rating',
        'photo',
        'is_featured',
        'sort_order',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'graduation_year' => 'integer',
        'rating' => 'integer',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Batasi query hanya pada alumni yang ditampilkan sebagai unggulan.
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Urutkan alumni berdasarkan urutan tampil, tahun lulus, lalu id.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('graduation_year')->orderBy('id');
    }
}
