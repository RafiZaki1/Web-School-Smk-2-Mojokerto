<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\UniformScheduleRepositoryInterface;
use App\Models\UniformSchedule;
use Illuminate\Database\Eloquent\Builder;

class UniformScheduleRepository extends BaseRepository implements UniformScheduleRepositoryInterface
{
    /** @var class-string<UniformSchedule> */
    protected string $model = UniformSchedule::class;

    /**
     * Jadwal seragam selalu tampil di web publik.
     */
    protected function onlyPublished(Builder $query): Builder
    {
        return $query;
    }
}
