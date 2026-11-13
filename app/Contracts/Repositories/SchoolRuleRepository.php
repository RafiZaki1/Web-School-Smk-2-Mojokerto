<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\SchoolRuleRepositoryInterface;
use App\Models\SchoolRule;
use Illuminate\Database\Eloquent\Builder;

class SchoolRuleRepository extends BaseRepository implements SchoolRuleRepositoryInterface
{
    /** @var class-string<SchoolRule> */
    protected string $model = SchoolRule::class;

    /**
     * Poin tata tertib yang tampil di web publik adalah poin aktif.
     */
    protected function onlyPublished(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Terapkan filter bagian tata tertib.
     *
     * @param  array<string, mixed>  $filters
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query->when($filters['section'] ?? null, fn (Builder $q, $section) => $q->where('section', $section));
    }
}
