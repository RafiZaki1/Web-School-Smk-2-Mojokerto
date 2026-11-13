<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\RecordServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\ApiRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * CRUD admin bersama untuk data TU tanpa slug. Turunan memberi service, resource,
 * label pesan, daftar filter query string, dan method store/update dengan request masing-masing.
 */
abstract class AdminRecordController extends Controller
{
    protected RecordServiceInterface $service;

    /** @var class-string<JsonResource> */
    protected string $resource;

    protected string $label;

    /** @var array<int, string> Nama query string yang diteruskan sebagai filter daftar. */
    protected array $filters = [];

    /**
     * Tampilkan seluruh data untuk tabel admin.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = array_filter($request->only($this->filters), fn ($value) => is_string($value) && $value !== '');

        return ResponseHelper::success(
            $this->resource::collection($this->service->getAll($filters)),
            trans('alert.fetch_success', ['resource' => $this->label])
        );
    }

    /**
     * Tampilkan satu data berdasarkan id.
     *
     * @param  string  $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        return ResponseHelper::success(
            $this->resource::make($this->service->find($id)),
            trans('alert.fetch_success', ['resource' => $this->label])
        );
    }

    /**
     * Hapus data beserta berkasnya.
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
     * Simpan data baru dari request yang sudah tervalidasi.
     *
     * @param  ApiRequest  $request
     * @return JsonResponse
     */
    protected function storeFrom(ApiRequest $request): JsonResponse
    {
        try {
            $model = $this->service->create($request->validated());

            return ResponseHelper::success(
                $this->resource::make($model),
                trans('alert.add_success', ['resource' => $this->label]),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Perbarui data dari request yang sudah tervalidasi.
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
                $this->resource::make($model),
                trans('alert.update_success', ['resource' => $this->label])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
