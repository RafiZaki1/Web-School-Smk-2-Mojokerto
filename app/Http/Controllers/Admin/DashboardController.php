<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\DashboardServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class DashboardController extends Controller
{
    /**
     * Inisialisasi DashboardController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  DashboardServiceInterface  $dashboardService
     */
    public function __construct(
        protected DashboardServiceInterface $dashboardService
    ) {}

    /**
     * Tampilkan ringkasan dashboard admin.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new DashboardResource($this->dashboardService->summary()),
                trans('alert.fetch_success', ['resource' => 'Ringkasan dashboard'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
