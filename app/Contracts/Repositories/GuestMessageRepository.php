<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\GuestMessageRepositoryInterface;
use App\Models\GuestMessage;
use Illuminate\Database\Eloquent\Builder;

class GuestMessageRepository extends BaseRepository implements GuestMessageRepositoryInterface
{
    /** @var class-string<GuestMessage> */
    protected string $model = GuestMessage::class;

    /**
     * Pesan buku tamu tidak pernah tampil di web publik.
     */
    protected function onlyPublished(Builder $query): Builder
    {
        return $query->whereRaw('1 = 0');
    }

    /**
     * Terapkan filter status dan pencarian nama, subjek, atau isi pesan.
     *
     * @param  array<string, mixed>  $filters
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['status'] ?? null, fn (Builder $q, $status) => $q->where('status', $status))
            ->when($filters['search'] ?? null, fn (Builder $q, $search) => $q->where(fn (Builder $inner) => $inner
                ->where('name', 'like', '%'.trim($search).'%')
                ->orWhere('subject', 'like', '%'.trim($search).'%')
                ->orWhere('message', 'like', '%'.trim($search).'%')));
    }
}
