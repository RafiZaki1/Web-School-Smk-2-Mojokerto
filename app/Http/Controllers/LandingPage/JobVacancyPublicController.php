<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\JobVacancyServiceInterface;
use App\Enums\JobCategoryEnum;
use App\Enums\JobEmploymentTypeEnum;
use App\Helpers\ResponseHelper;
use App\Http\Resources\JobVacancyResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class JobVacancyPublicController extends PublicContentController
{
    /** @var class-string */
    protected string $resource = JobVacancyResource::class;

    protected string $label = 'Lowongan';

    /**
     * Inisialisasi JobVacancyPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  JobVacancyServiceInterface  $service
     */
    public function __construct(JobVacancyServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Tampilkan pilihan bidang dan tipe kerja untuk filter lowongan.
     *
     * @return JsonResponse
     */
    public function options(): JsonResponse
    {
        try {
            return ResponseHelper::success([
                'categories' => JobCategoryEnum::values(),
                'types' => JobEmploymentTypeEnum::values(),
            ], trans('alert.fetch_success', ['resource' => 'Opsi lowongan']));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
