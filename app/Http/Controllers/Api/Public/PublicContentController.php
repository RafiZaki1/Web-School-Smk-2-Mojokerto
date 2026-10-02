<?php

namespace App\Http\Controllers\Api\Public;

use App\Contracts\Interfaces\ContentServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Daftar & detail konten yang sudah terbit untuk halaman publik.
 * Filter yang didukung: category, level, year, status, q (pencarian), exclude (slug), limit.
 */
abstract class PublicContentController extends Controller
{
    protected ContentServiceInterface $service;

    /** @var class-string<JsonResource> */
    protected string $resource;

    protected string $label;

    public function index(Request $request): JsonResponse
    {
        $filters = array_filter([
            'category' => $request->query('category'),
            'level' => $request->query('level'),
            'year' => $request->query('year'),
            'status' => $request->query('status'),
            'search' => $request->query('q'),
            'exclude' => $request->query('exclude'),
            'limit' => min(100, max(0, (int) $request->query('limit', 0))),
        ]);

        return ApiResponse::success(
            $this->resource::collection($this->service->getPublished($filters)),
            "{$this->label} berhasil dimuat"
        );
    }

    public function show(string $slug): JsonResponse
    {
        return ApiResponse::success(
            new $this->resource($this->service->getPublishedByIdentifier($slug)),
            "{$this->label} berhasil dimuat"
        );
    }
}
