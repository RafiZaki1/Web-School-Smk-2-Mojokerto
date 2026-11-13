<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\PracticeUniformRepositoryInterface;
use App\Models\PracticeUniform;
use Illuminate\Database\Eloquent\Builder;

class PracticeUniformRepository extends BaseRepository implements PracticeUniformRepositoryInterface
{
    /** @var class-string<PracticeUniform> */
    protected string $model = PracticeUniform::class;

    /**
     * Seragam praktik selalu tampil di web publik.
     */
    protected function onlyPublished(Builder $query): Builder
    {
        return $query;
    }
}
