<?php

namespace App\Models;

use App\Enums\TeacherGroupEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'slug',
        'name',
        'position',
        'group',
        'subject',
        'photo',
        'is_published',
        'sort_order',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Batasi query hanya pada guru dan tenaga kependidikan yang diterbitkan.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * Urutkan guru berdasarkan kelompok tampilan, urutan tampil, lalu nama.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        $cases = collect(TeacherGroupEnum::cases())
            ->map(fn (TeacherGroupEnum $group, int $index) => "WHEN '{$group->value}' THEN {$index}")
            ->implode(' ');
        $column = $query->getQuery()->getGrammar()->wrap('group');

        return $query
            ->orderByRaw("CASE {$column} {$cases} ELSE 99 END")
            ->orderBy('sort_order')
            ->orderBy('name');
    }
}
