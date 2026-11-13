<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\ContentServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Throwable;

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

    /** @var array<int, string> Nama filter query string tambahan khusus modul, mis. ['when'] untuk agenda. */
    protected array $extraFilters = [];

    /**
     * Tampilkan daftar konten yang sudah terbit beserta filter dari query string.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = array_filter([
                'category' => $request->query('category'),
                'level' => $request->query('level'),
                'year' => $request->query('year'),
                'status' => $request->query('status'),
                'search' => $request->query('q'),
                'exclude' => $request->query('exclude'),
                'limit' => min(100, max(0, (int) $request->query('limit', 0))),
                ...collect($this->extraFilters)->mapWithKeys(fn (string $key) => [$key => is_string($value = $request->query($key)) ? $value : null])->all(),
            ]);

            return ResponseHelper::success(
                $this->resource::collection($this->service->getPublished($filters)),
                trans('alert.fetch_success', ['resource' => $this->label])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan detail konten yang sudah terbit berdasarkan slug.
     *
     * @param  string  $slug
     * @return JsonResponse
     */
    public function show(string $slug): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new $this->resource($this->service->getPublishedByIdentifier($slug)),
                trans('alert.fetch_success', ['resource' => $this->label])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
