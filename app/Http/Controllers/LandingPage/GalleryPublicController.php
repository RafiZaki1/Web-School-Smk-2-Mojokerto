<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\GalleryServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class GalleryPublicController extends Controller
{
    /**
     * Inisialisasi GalleryPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GalleryServiceInterface  $galleryService
     */
    public function __construct(
        protected GalleryServiceInterface $galleryService
    ) {}

    /**
     * Tampilkan foto galeri yang aktif, opsional difilter per kategori.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                GalleryResource::collection($this->galleryService->getActiveGalleries($request->query('category'))),
                trans('alert.fetch_success', ['resource' => 'Galeri'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
