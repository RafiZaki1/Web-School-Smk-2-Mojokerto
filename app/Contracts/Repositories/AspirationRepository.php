<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\AspirationRepositoryInterface;
use App\Models\Aspiration;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class AspirationRepository extends BaseRepository implements AspirationRepositoryInterface
{
    protected string $model = Aspiration::class;

    protected function ordered(Builder $query): Builder
    {
        return $query->latestFirst();
    }

    public function followedUp(int $limit = 10): Collection
    {
        return $this->query()
            ->followedUp()
            ->orderByDesc('responded_at')
            ->latestFirst()
            ->limit($limit)
            ->get();
    }

    public function countByStatus(): array
    {
        $counts = $this->query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return collect(Aspiration::STATUSES)
            ->mapWithKeys(fn (string $status) => [$status => (int) ($counts[$status] ?? 0)])
            ->all();
    }
}
