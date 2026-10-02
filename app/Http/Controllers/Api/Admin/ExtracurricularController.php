<?php

namespace App\Http\Controllers\Api\Admin;

use App\Contracts\Interfaces\ExtracurricularServiceInterface;
use App\Http\Requests\Content\ExtracurricularRequest;
use App\Http\Resources\ExtracurricularResource;
use Illuminate\Http\JsonResponse;

class ExtracurricularController extends AdminContentController
{
    protected string $resource = ExtracurricularResource::class;

    protected string $label = 'Ekstrakurikuler';

    public function __construct(ExtracurricularServiceInterface $service)
    {
        $this->service = $service;
    }

    public function store(ExtracurricularRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    public function update(ExtracurricularRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
