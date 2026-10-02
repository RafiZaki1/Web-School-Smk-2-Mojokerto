<?php

namespace App\Http\Controllers\Api\Public;

use App\Contracts\Interfaces\SiteContentServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\SiteContentResource;
use Illuminate\Http\JsonResponse;

class SiteContentPublicController extends Controller
{
    public function __construct(
        protected SiteContentServiceInterface $siteContentService
    ) {}

    public function show(string $key): JsonResponse
    {
        return ApiResponse::success(
            new SiteContentResource($this->siteContentService->get($key)),
            'Konten berhasil dimuat'
        );
    }
}
