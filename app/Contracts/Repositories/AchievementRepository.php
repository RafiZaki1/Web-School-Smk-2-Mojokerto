<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\AchievementRepositoryInterface;
use App\Models\Achievement;
use Illuminate\Database\Eloquent\Builder;

class AchievementRepository extends BaseRepository implements AchievementRepositoryInterface
{
    protected string $model = Achievement::class;

    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['category'] ?? null, fn (Builder $q, $category) => $q->where('category', $category))
            ->when($filters['level'] ?? null, fn (Builder $q, $level) => $q->where('level', $level))
            ->when($filters['year'] ?? null, fn (Builder $q, $year) => $q->whereYear('start_date', $year));
    }
}
