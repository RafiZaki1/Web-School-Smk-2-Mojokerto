<?php

namespace App\Http\Controllers\Api\Public;

use App\Contracts\Interfaces\JobVacancyServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Resources\JobVacancyResource;
use App\Models\JobVacancy;
use Illuminate\Http\JsonResponse;

class JobVacancyPublicController extends PublicContentController
{
    protected string $resource = JobVacancyResource::class;

    protected string $label = 'Lowongan';

    public function __construct(JobVacancyServiceInterface $service)
    {
        $this->service = $service;
    }

    /** Kategori bidang & tipe kerja untuk filter lowongan. */
    public function options(): JsonResponse
    {
        return ApiResponse::success([
            'categories' => JobVacancy::CATEGORIES,
            'types' => JobVacancy::TYPES,
        ], 'Opsi lowongan berhasil dimuat');
    }
}
