<?php

namespace App\Http\Controllers\Api\Admin;

use App\Contracts\Interfaces\SiteContentServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Content\SiteContentRequest;
use App\Http\Resources\SiteContentResource;
use Illuminate\Http\JsonResponse;

class SiteContentController extends Controller
{
    public function __construct(
        protected SiteContentServiceInterface $siteContentService
    ) {}

    public function show(string $key): JsonResponse
    {
        return ApiResponse::success(new SiteContentResource($this->siteContentService->get($key)), 'Konten berhasil dimuat');
    }

    public function update(SiteContentRequest $request, string $key): JsonResponse
    {
        return ApiResponse::success(
            new SiteContentResource($this->siteContentService->put($key, $request->validated('value'))),
            'Konten berhasil diperbarui'
        );
    }
}
