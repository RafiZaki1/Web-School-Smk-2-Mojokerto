<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\AlumniServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\AlumniRequest;
use App\Http\Resources\AlumniResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AlumniController extends Controller
{
    /**
     * Inisialisasi AlumniController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected AlumniServiceInterface $alumniService
    ) {}

    /**
     * Tampilkan seluruh data alumni.
     */
    public function index(): JsonResponse
    {
        return ResponseHelper::success(
            AlumniResource::collection($this->alumniService->getList()),
            trans('alert.fetch_success', ['resource' => 'Lulusan'])
        );
    }

    /**
     * Simpan data alumni baru.
     */
    public function store(AlumniRequest $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new AlumniResource($this->alumniService->create($request->validated())),
                trans('alert.add_success', ['resource' => 'Lulusan']),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan satu data alumni.
     */
    public function show(string $id): JsonResponse
    {
        return ResponseHelper::success(
            new AlumniResource($this->alumniService->getById($id)),
            trans('alert.fetch_success', ['resource' => 'Lulusan'])
        );
    }

    /**
     * Perbarui data alumni.
     */
    public function update(AlumniRequest $request, string $id): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new AlumniResource($this->alumniService->update($id, $request->validated())),
                trans('alert.update_success', ['resource' => 'Lulusan'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus data alumni beserta fotonya.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->alumniService->delete($id);

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => 'Lulusan']));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
