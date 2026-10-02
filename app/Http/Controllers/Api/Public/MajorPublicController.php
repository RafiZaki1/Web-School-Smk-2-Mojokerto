<?php

namespace App\Http\Controllers\Api\Public;

use App\Contracts\Interfaces\MajorServiceInterface;
use App\Http\Resources\MajorResource;

class MajorPublicController extends PublicContentController
{
    protected string $resource = MajorResource::class;

    protected string $label = 'Jurusan';

    public function __construct(MajorServiceInterface $service)
    {
        $this->service = $service;
    }
}
