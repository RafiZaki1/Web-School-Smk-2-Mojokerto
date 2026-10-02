<?php

namespace App\Http\Controllers\Api\Admin;

use App\Contracts\Interfaces\DashboardServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardServiceInterface $dashboardService
    ) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success($this->dashboardService->summary(), 'Ringkasan dashboard berhasil dimuat');
    }
}
