<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\TeacherServiceInterface;
use App\Enums\TeacherGroupEnum;
use App\Helpers\ResponseHelper;
use App\Http\Resources\TeacherResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class TeacherPublicController extends PublicContentController
{
    /** @var class-string */
    protected string $resource = TeacherResource::class;

    protected string $label = 'Guru & staf';

    /** @var array<int, string> */
    protected array $extraFilters = ['group'];

    /**
     * Inisialisasi TeacherPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  TeacherServiceInterface  $service
     */
    public function __construct(TeacherServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Tampilkan kelompok guru dan staf beserta labelnya.
     *
     * @return JsonResponse
     */
    public function groups(): JsonResponse
    {
        try {
            return ResponseHelper::success(
                TeacherGroupEnum::options(),
                trans('alert.fetch_success', ['resource' => 'Kelompok guru & staf'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
