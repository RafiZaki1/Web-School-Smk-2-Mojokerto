<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\HeroServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\HeroResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class HeroPublicController extends Controller
{
    /**
     * Inisialisasi HeroPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  HeroServiceInterface  $heroService
     */
    public function __construct(
        protected HeroServiceInterface $heroService
    ) {}

    /**
     * Tampilkan banner beranda yang aktif.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            return ResponseHelper::success(
                HeroResource::collection($this->heroService->getActiveHeroes()),
                trans('alert.fetch_success', ['resource' => 'Banner'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
