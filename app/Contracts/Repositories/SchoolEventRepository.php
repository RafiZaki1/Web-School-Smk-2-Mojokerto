<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\SchoolEventRepositoryInterface;
use App\Models\SchoolEvent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class SchoolEventRepository extends BaseRepository implements SchoolEventRepositoryInterface
{
    /** @var class-string<SchoolEvent> */
    protected string $model = SchoolEvent::class;

    /**
     * Terapkan filter waktu, kategori, pencarian judul, dan pengecualian slug pada daftar agenda.
     *
     * @param  array<string, mixed>  $filters
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when(($filters['when'] ?? null) === 'upcoming', fn (Builder $q) => $q->upcoming())
            ->when(($filters['when'] ?? null) === 'past', fn (Builder $q) => $q->past())
            ->when($filters['category'] ?? null, fn (Builder $q, $category) => $q->where('category', $category))
            ->when($filters['search'] ?? null, fn (Builder $q, $search) => $q->where('title', 'like', '%'.trim($search).'%'))
            ->when($filters['exclude'] ?? null, fn (Builder $q, $slug) => $q->where('slug', '!=', $slug));
    }

    /**
     * Ambil agenda yang diterbitkan. Agenda mendatang diurutkan dari yang paling dekat, selain itu terbaru dulu.
     *
     * @param  array<string, mixed>  $filters
     */
    public function published(array $filters = []): Collection
    {
        $query = $this->applyFilters($this->onlyPublished($this->query()), $filters);

        if (($filters['when'] ?? null) === 'upcoming') {
            $query->orderBy('starts_on')->orderBy('id');
        } else {
            $query->ordered();
        }

        if (! empty($filters['limit'])) {
            $query->limit((int) $filters['limit']);
        }

        return $query->get();
    }
}
