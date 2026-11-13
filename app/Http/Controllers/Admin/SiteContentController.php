<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\SiteContentServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\SiteContentRequest;
use App\Http\Resources\SiteContentResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class SiteContentController extends Controller
{
    /**
     * Inisialisasi SiteContentController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected SiteContentServiceInterface $siteContentService
    ) {}

    /**
     * Tampilkan konten halaman berdasarkan kunci.
     */
    public function show(string $key): JsonResponse
    {
        return ResponseHelper::success(
            new SiteContentResource($this->siteContentService->get($key)),
            trans('alert.fetch_success', ['resource' => 'Konten'])
        );
    }

    /**
     * Perbarui isi konten halaman.
     */
    public function update(SiteContentRequest $request, string $key): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new SiteContentResource($this->siteContentService->put($key, $request->validated('value'))),
                trans('alert.update_success', ['resource' => 'Konten'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
