<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\InternshipDocumentationRepositoryInterface;
use App\Models\InternshipDocumentation;
use Illuminate\Database\Eloquent\Builder;

class InternshipDocumentationRepository extends BaseRepository implements InternshipDocumentationRepositoryInterface
{
    /** @var class-string<InternshipDocumentation> */
    protected string $model = InternshipDocumentation::class;

    /**
     * Query dasar beserta mitra tempat PKL agar tidak terjadi N+1.
     */
    protected function query(): Builder
    {
        return $this->model::query()->with('industryPartner:id,name');
    }

    /**
     * Terapkan filter jurusan pada dokumentasi PKL.
     *
     * @param  array<string, mixed>  $filters
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query->when($filters['major'] ?? null, fn (Builder $q, $major) => $q->where('major_code', $major));
    }
}
