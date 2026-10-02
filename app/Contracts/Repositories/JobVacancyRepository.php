<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\JobVacancyRepositoryInterface;
use App\Models\JobVacancy;
use Illuminate\Database\Eloquent\Builder;

class JobVacancyRepository extends BaseRepository implements JobVacancyRepositoryInterface
{
    protected string $model = JobVacancy::class;

    /** Lowongan tidak punya draf; yang tutup tetap tampil dengan label "Tutup". */
    protected function onlyPublished(Builder $query): Builder
    {
        return $query;
    }

    protected function ordered(Builder $query): Builder
    {
        // Lowongan aktif lebih dulu, lalu yang paling cepat tutup
        return $query->orderByRaw('status = ? desc', [JobVacancy::STATUS_OPEN])->ordered();
    }

    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['category'] ?? null, fn (Builder $q, $category) => $q->where('category', $category))
            ->when($filters['status'] ?? null, fn (Builder $q, $status) => $q->where('status', $status))
            ->when($filters['search'] ?? null, function (Builder $q, $search) {
                $term = '%'.trim($search).'%';
                $q->where(fn (Builder $inner) => $inner->where('title', 'like', $term)->orWhere('company', 'like', $term));
            });
    }
}
