<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IndustryPartner extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'name',
        'logo',
        'major_codes',
        'city',
        'website',
        'description',
        'is_active',
        'sort_order',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'major_codes' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function internshipDocumentations(): HasMany
    {
        return $this->hasMany(InternshipDocumentation::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Mitra yang melayani jurusan tertentu. Mitra umum (major_codes kosong) tidak ikut.
     */
    public function scopeForMajor(Builder $query, ?string $majorCode): Builder
    {
        return $majorCode ? $query->whereJsonContains('major_codes', $majorCode) : $query;
    }
}
