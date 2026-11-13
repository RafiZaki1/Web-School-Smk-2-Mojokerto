<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\SchoolAdministrationDashboardServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class SchoolAdministrationDashboardController extends Controller
{
    /**
     * Inisialisasi SchoolAdministrationDashboardController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SchoolAdministrationDashboardServiceInterface  $service
     */
    public function __construct(protected SchoolAdministrationDashboardServiceInterface $service) {}

    /**
     * Tampilkan ringkasan dashboard TU.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return ResponseHelper::success($this->service->summary(), trans('alert.fetch_success', ['resource' => 'Ringkasan TU']));
    }
}
