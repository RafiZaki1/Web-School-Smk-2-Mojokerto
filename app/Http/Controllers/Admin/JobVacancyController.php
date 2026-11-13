<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\JobVacancyServiceInterface;
use App\Http\Requests\JobVacancyRequest;
use App\Http\Resources\JobVacancyResource;
use Illuminate\Http\JsonResponse;

class JobVacancyController extends AdminContentController
{
    /** @var class-string */
    protected string $resource = JobVacancyResource::class;

    protected string $label = 'Lowongan';

    /**
     * Inisialisasi JobVacancyController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(JobVacancyServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Simpan lowongan baru.
     */
    public function store(JobVacancyRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui lowongan.
     */
    public function update(JobVacancyRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
