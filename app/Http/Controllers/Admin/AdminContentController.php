<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\ContentServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\ApiRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * CRUD admin bersama untuk konten bergaya slug. Turunan cukup memberi
 * service, kelas resource, label pesan, dan method store/update yang
 * memakai request masing-masing.
 */
abstract class AdminContentController extends Controller
{
    protected ContentServiceInterface $service;

    /** @var class-string<JsonResource> */
    protected string $resource;

    /** @var string Nama konten untuk pesan respons, mis. "Jurusan". */
    protected string $label;

    /**
     * Tampilkan seluruh konten untuk admin.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            return ResponseHelper::success(
                $this->resource::collection($this->service->getAll()),
                trans('alert.fetch_success', ['resource' => $this->label])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan satu konten berdasarkan id atau slug.
     *
     * @param  string  $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new $this->resource($this->service->getByIdentifier($id)),
                trans('alert.fetch_success', ['resource' => $this->label])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus konten beserta berkasnya.
     *
     * @param  string  $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->service->delete($id);

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => $this->label]));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Simpan konten baru dari request yang sudah tervalidasi.
     *
     * @param  ApiRequest  $request
     * @return JsonResponse
     */
    protected function storeFrom(ApiRequest $request): JsonResponse
    {
        try {
            $model = $this->service->create($request->validated());

            return ResponseHelper::success(
                new $this->resource($model),
                trans('alert.add_success', ['resource' => $this->label]),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Perbarui konten dari request yang sudah tervalidasi.
     *
     * @param  ApiRequest  $request
     * @param  string  $id
     * @return JsonResponse
     */
    protected function updateFrom(ApiRequest $request, string $id): JsonResponse
    {
        try {
            $model = $this->service->update($id, $request->validated());

            return ResponseHelper::success(
                new $this->resource($model),
                trans('alert.update_success', ['resource' => $this->label])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
