<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\ExtracurricularRepositoryInterface;
use App\Models\Extracurricular;

class ExtracurricularRepository extends BaseRepository implements ExtracurricularRepositoryInterface
{
    /** @var class-string<Extracurricular> */
    protected string $model = Extracurricular::class;
}
