<?php

namespace App\Http\Controllers\Api\Public;

use App\Contracts\Interfaces\ExtracurricularServiceInterface;
use App\Http\Resources\ExtracurricularResource;

class ExtracurricularPublicController extends PublicContentController
{
    protected string $resource = ExtracurricularResource::class;

    protected string $label = 'Ekstrakurikuler';

    public function __construct(ExtracurricularServiceInterface $service)
    {
        $this->service = $service;
    }
}
