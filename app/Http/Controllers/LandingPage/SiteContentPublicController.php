<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\SiteContentServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\SiteContentResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class SiteContentPublicController extends Controller
{
    /**
     * Inisialisasi SiteContentPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SiteContentServiceInterface  $siteContentService
     */
    public function __construct(
        protected SiteContentServiceInterface $siteContentService
    ) {}

    /**
     * Tampilkan konten halaman publik berdasarkan kunci.
     *
     * @param  string  $key
     * @return JsonResponse
     */
    public function show(string $key): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new SiteContentResource($this->siteContentService->get($key)),
                trans('alert.fetch_success', ['resource' => 'Konten'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
