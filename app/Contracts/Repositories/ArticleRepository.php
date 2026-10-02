<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\ArticleRepositoryInterface;
use App\Models\Article;
use Illuminate\Database\Eloquent\Builder;

class ArticleRepository extends BaseRepository implements ArticleRepositoryInterface
{
    protected string $model = Article::class;

    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['category'] ?? null, fn (Builder $q, $category) => $q->where('category', $category))
            ->when($filters['search'] ?? null, fn (Builder $q, $search) => $q->where('title', 'like', '%'.trim($search).'%'))
            ->when($filters['exclude'] ?? null, fn (Builder $q, $slug) => $q->where('slug', '!=', $slug));
    }
}
