<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\PracticeUniformServiceInterface;
use App\Contracts\Interfaces\SchoolRuleServiceInterface;
use App\Contracts\Interfaces\UniformScheduleServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\PracticeUniformResource;
use App\Http\Resources\SchoolRuleResource;
use App\Http\Resources\UniformScheduleResource;
use Illuminate\Http\JsonResponse;

/**
 * Halaman Tata Tertib & Seragam: poin aturan aktif, seragam harian Senin-Jumat,
 * dan seragam praktik 5 jurusan dalam satu respons.
 */
class StudentGuidePublicController extends Controller
{
    /**
     * Inisialisasi StudentGuidePublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SchoolRuleServiceInterface  $rules
     * @param  UniformScheduleServiceInterface  $schedules
     * @param  PracticeUniformServiceInterface  $practiceUniforms
     */
    public function __construct(
        protected SchoolRuleServiceInterface $rules,
        protected UniformScheduleServiceInterface $schedules,
        protected PracticeUniformServiceInterface $practiceUniforms,
    ) {}

    /**
     * Tampilkan tata tertib dan panduan seragam.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return ResponseHelper::success([
            'rules' => SchoolRuleResource::collection($this->rules->getPublished()),
            'uniform_schedules' => UniformScheduleResource::collection($this->schedules->getPublished()),
            'practice_uniforms' => PracticeUniformResource::collection($this->practiceUniforms->getPublished()),
        ], trans('alert.fetch_success', ['resource' => 'Tata tertib & seragam']));
    }
}
