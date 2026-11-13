<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\RecordServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Daftar data TU yang tampil di web publik. Turunan menentukan service, resource,
 * label pesan, dan nama filter query string yang diterima.
 */
abstract class PublicRecordController extends Controller
{
    protected RecordServiceInterface $service;

    /** @var class-string<JsonResource> */
    protected string $resource;

    protected string $label;

    /** @var array<int, string> */
    protected array $filters = [];

    /**
     * Tampilkan data publik beserta filter dan batas jumlah dari query string.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = array_filter($request->only($this->filters), fn ($value) => is_string($value) && $value !== '');
        $filters['limit'] = min(100, max(0, (int) $request->query('limit', 0)));

        return ResponseHelper::success(
            $this->resource::collection($this->service->getPublished(array_filter($filters))),
            trans('alert.fetch_success', ['resource' => $this->label])
        );
    }
}
