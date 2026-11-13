<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class MajorQuizSubmission extends Model
{
    /** @var array<int, string> */
    protected $fillable = [
        'code',
        'name',
        'email',
        'answers',
        'scores',
        'total_answered',
        'analysis',
        'match_method',
        'recommended_major',
        'alternative_major',
        'final_major',
        'public_note',
        'admin_note',
        'status',
        'reviewed_at',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'answers' => 'array',
        'scores' => 'array',
        'total_answered' => 'integer',
        'reviewed_at' => 'datetime',
    ];

    /**
     * Ambil kode jurusan hasil: koreksi admin bila ada, selain itu rekomendasi sistem.
     */
    public function resultMajor(): string
    {
        return $this->final_major ?: $this->recommended_major;
    }

    /**
     * Urutkan log kuis dari yang terbaru dibuat.
     */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('created_at')->orderByDesc('id');
    }
}
