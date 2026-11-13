<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\GuestVisitRepositoryInterface;
use App\Models\GuestVisit;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class GuestVisitRepository extends BaseRepository implements GuestVisitRepositoryInterface
{
    /** @var class-string<GuestVisit> */
    protected string $model = GuestVisit::class;

    /**
     * Jadwal kunjungan tidak pernah tampil di web publik.
     */
    protected function onlyPublished(Builder $query): Builder
    {
        return $query->whereRaw('1 = 0');
    }

    /**
     * Urutkan kunjungan dari tanggal terbaru, lalu jam kunjungan.
     */
    protected function ordered(Builder $query): Builder
    {
        return $query->orderByDesc('visit_date')->orderBy('visit_time')->orderByDesc('id');
    }

    /**
     * Terapkan filter status dan rentang waktu (upcoming = hari ini dan sesudahnya, past = sebelum hari ini).
     *
     * @param  array<string, mixed>  $filters
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        $today = Carbon::today()->toDateString();

        return $query
            ->when($filters['status'] ?? null, fn (Builder $q, $status) => $q->where('status', $status))
            ->when(($filters['when'] ?? null) === 'upcoming', fn (Builder $q) => $q->whereDate('visit_date', '>=', $today))
            ->when(($filters['when'] ?? null) === 'past', fn (Builder $q) => $q->whereDate('visit_date', '<', $today));
    }
}
