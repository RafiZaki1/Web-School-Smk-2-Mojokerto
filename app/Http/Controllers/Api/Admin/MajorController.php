<?php

namespace App\Http\Controllers\Api\Admin;

use App\Contracts\Interfaces\MajorServiceInterface;
use App\Http\Requests\Content\MajorRequest;
use App\Http\Resources\MajorResource;
use Illuminate\Http\JsonResponse;

class MajorController extends AdminContentController
{
    protected string $resource = MajorResource::class;

    protected string $label = 'Jurusan';

    public function __construct(MajorServiceInterface $service)
    {
        $this->service = $service;
    }

    public function store(MajorRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    public function update(MajorRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
