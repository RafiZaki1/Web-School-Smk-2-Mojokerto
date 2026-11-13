<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\IndustryPartnerRepositoryInterface;
use App\Models\IndustryPartner;
use Illuminate\Database\Eloquent\Builder;

class IndustryPartnerRepository extends BaseRepository implements IndustryPartnerRepositoryInterface
{
    /** @var class-string<IndustryPartner> */
    protected string $model = IndustryPartner::class;

    /**
     * Mitra yang tampil di web publik adalah mitra aktif.
     */
    protected function onlyPublished(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Terapkan filter jurusan dan pencarian nama mitra.
     *
     * @param  array<string, mixed>  $filters
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['major'] ?? null, fn (Builder $q, $major) => $q->whereJsonContains('major_codes', $major))
            ->when($filters['search'] ?? null, fn (Builder $q, $search) => $q->where('name', 'like', '%'.trim($search).'%'));
    }
}
