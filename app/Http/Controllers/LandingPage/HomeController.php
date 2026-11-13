<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\HomeServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\HomeResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class HomeController extends Controller
{
    /**
     * Inisialisasi HomeController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  HomeServiceInterface  $homeService
     */
    public function __construct(
        protected HomeServiceInterface $homeService
    ) {}

    /**
     * Tampilkan seluruh data gabungan untuk halaman beranda.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new HomeResource($this->homeService->getHomeData()),
                trans('alert.fetch_success', ['resource' => 'Beranda'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
