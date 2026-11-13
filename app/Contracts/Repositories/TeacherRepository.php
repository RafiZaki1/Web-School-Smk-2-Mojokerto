<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\TeacherRepositoryInterface;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Builder;

class TeacherRepository extends BaseRepository implements TeacherRepositoryInterface
{
    /** @var class-string<Teacher> */
    protected string $model = Teacher::class;

    /**
     * Terapkan filter kelompok dan pencarian nama atau bidang pada daftar guru.
     *
     * @param  array<string, mixed>  $filters
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['group'] ?? null, fn (Builder $q, $group) => $q->where('group', $group))
            ->when($filters['search'] ?? null, fn (Builder $q, $search) => $q->where(fn (Builder $inner) => $inner
                ->where('name', 'like', '%'.trim($search).'%')
                ->orWhere('subject', 'like', '%'.trim($search).'%')));
    }
}
