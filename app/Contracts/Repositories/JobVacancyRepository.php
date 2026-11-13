<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\JobVacancyRepositoryInterface;
use App\Enums\JobVacancyStatusEnum;
use App\Models\JobVacancy;
use Illuminate\Database\Eloquent\Builder;

class JobVacancyRepository extends BaseRepository implements JobVacancyRepositoryInterface
{
    /** @var class-string<JobVacancy> */
    protected string $model = JobVacancy::class;

    /**
     * Lowongan tidak memiliki draf, jadi semua data tetap ditampilkan termasuk yang sudah tutup.
     */
    protected function onlyPublished(Builder $query): Builder
    {
        return $query;
    }

    /**
     * Urutkan lowongan aktif lebih dulu, lalu yang paling cepat tutup.
     */
    protected function ordered(Builder $query): Builder
    {
        return $query->orderByRaw('status = ? desc', [JobVacancyStatusEnum::OPEN->value])->ordered();
    }

    /**
     * Terapkan filter kategori, status, dan pencarian judul atau perusahaan pada daftar lowongan.
     *
     * @param  array<string, mixed>  $filters
     */
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
