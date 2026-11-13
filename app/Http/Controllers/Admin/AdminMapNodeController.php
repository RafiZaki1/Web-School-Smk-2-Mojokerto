<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\MapServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMapNodeRequest;
use App\Http\Requests\UpdateMapNodeRequest;
use App\Http\Resources\MapNodeResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AdminMapNodeController extends Controller
{
    /**
     * Inisialisasi AdminMapNodeController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MapServiceInterface $mapService
    ) {}

    /**
     * Tampilkan seluruh titik peta.
     */
    public function index(): JsonResponse
    {
        return ResponseHelper::success(
            MapNodeResource::collection($this->mapService->getAllNodes()),
            trans('alert.fetch_success', ['resource' => 'Titik peta'])
        );
    }

    /**
     * Simpan titik peta baru.
     */
    public function store(StoreMapNodeRequest $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new MapNodeResource($this->mapService->createNode($request->validated())),
                trans('alert.add_success', ['resource' => 'Titik peta']),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan satu titik peta.
     */
    public function show(int|string $node): JsonResponse
    {
        return ResponseHelper::success(
            new MapNodeResource($this->mapService->getNodeById($node)),
            trans('alert.fetch_success', ['resource' => 'Titik peta'])
        );
    }

    /**
     * Perbarui titik peta.
     */
    public function update(UpdateMapNodeRequest $request, int|string $node): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new MapNodeResource($this->mapService->updateNode($node, $request->validated())),
                trans('alert.update_success', ['resource' => 'Titik peta'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus titik peta. Sisi yang terhubung dihapus dan ruangan yang menempel dilepas dalam satu transaksi.
     */
    public function destroy(int|string $node): JsonResponse
    {
        DB::beginTransaction();

        try {
            $this->mapService->deleteNode($node);

            DB::commit();

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => 'Titik peta']));
        } catch (Throwable $th) {
            DB::rollBack();

            return $this->writeError($th);
        }
    }
}
