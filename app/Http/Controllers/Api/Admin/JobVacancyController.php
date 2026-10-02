<?php

namespace App\Http\Controllers\Api\Admin;

use App\Contracts\Interfaces\JobVacancyServiceInterface;
use App\Http\Requests\Content\JobVacancyRequest;
use App\Http\Resources\JobVacancyResource;
use Illuminate\Http\JsonResponse;

class JobVacancyController extends AdminContentController
{
    protected string $resource = JobVacancyResource::class;

    protected string $label = 'Lowongan';

    public function __construct(JobVacancyServiceInterface $service)
    {
        $this->service = $service;
    }

    public function store(JobVacancyRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    public function update(JobVacancyRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
