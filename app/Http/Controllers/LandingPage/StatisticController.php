<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\StatisticServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\StatisticResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class StatisticController extends Controller
{
    /**
     * Inisialisasi StatisticController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  StatisticServiceInterface  $statisticService
     */
    public function __construct(
        protected StatisticServiceInterface $statisticService
    ) {}

    /**
     * Tampilkan statistik sekolah.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new StatisticResource($this->statisticService->getStatistics()),
                trans('alert.fetch_success', ['resource' => 'Statistik'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
