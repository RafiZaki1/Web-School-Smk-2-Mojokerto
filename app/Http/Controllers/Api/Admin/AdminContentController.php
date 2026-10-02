<?php

namespace App\Http\Controllers\Api\Admin;

use App\Contracts\Interfaces\ContentServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Response;

/**
 * CRUD admin bersama untuk konten bergaya slug. Turunan cukup memberi
 * service, kelas resource, label pesan, dan method store/update yang
 * memakai FormRequest masing-masing. 404 & 422 ditangani exception handler.
 */
abstract class AdminContentController extends Controller
{
    protected ContentServiceInterface $service;

    /** @var class-string<JsonResource> */
    protected string $resource;

    /** Nama konten untuk pesan respons, mis. "Jurusan". */
    protected string $label;

    public function index(): JsonResponse
    {
        return ApiResponse::success(
            $this->resource::collection($this->service->getAll()),
            "{$this->label} berhasil dimuat"
        );
    }

    public function show(string $id): JsonResponse
    {
        return ApiResponse::success(
            new $this->resource($this->service->getByIdentifier($id)),
            "{$this->label} berhasil dimuat"
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->service->delete($id);

        return ApiResponse::success(null, "{$this->label} berhasil dihapus");
    }

    protected function storeFrom(FormRequest $request): JsonResponse
    {
        return ApiResponse::success(
            new $this->resource($this->service->create($request->validated())),
            "{$this->label} berhasil disimpan",
            Response::HTTP_CREATED
        );
    }

    protected function updateFrom(FormRequest $request, string $id): JsonResponse
    {
        return ApiResponse::success(
            new $this->resource($this->service->update($id, $request->validated())),
            "{$this->label} berhasil diperbarui"
        );
    }
}
