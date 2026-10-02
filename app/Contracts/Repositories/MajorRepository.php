<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\MajorRepositoryInterface;
use App\Models\Major;

class MajorRepository extends BaseRepository implements MajorRepositoryInterface
{
    protected string $model = Major::class;
}
