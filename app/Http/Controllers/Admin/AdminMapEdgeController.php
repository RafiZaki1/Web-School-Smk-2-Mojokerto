<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\MapServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMapEdgeRequest;
use App\Http\Requests\UpdateMapEdgeRequest;
use App\Http\Resources\MapEdgeResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AdminMapEdgeController extends Controller
{
    /**
     * Inisialisasi AdminMapEdgeController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MapServiceInterface $mapService
    ) {}

    /**
     * Tampilkan seluruh sisi peta.
     */
    public function index(): JsonResponse
    {
        return ResponseHelper::success(
            MapEdgeResource::collection($this->mapService->getAllEdges()),
            trans('alert.fetch_success', ['resource' => 'Sisi peta'])
        );
    }

    /**
     * Simpan sisi peta baru.
     */
    public function store(StoreMapEdgeRequest $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new MapEdgeResource($this->mapService->createEdge($request->validated())),
                trans('alert.add_success', ['resource' => 'Sisi peta']),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan satu sisi peta.
     */
    public function show(int|string $edge): JsonResponse
    {
        return ResponseHelper::success(
            new MapEdgeResource($this->mapService->getEdgeById($edge)),
            trans('alert.fetch_success', ['resource' => 'Sisi peta'])
        );
    }

    /**
     * Perbarui sisi peta.
     */
    public function update(UpdateMapEdgeRequest $request, int|string $edge): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new MapEdgeResource($this->mapService->updateEdge($edge, $request->validated())),
                trans('alert.update_success', ['resource' => 'Sisi peta'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus sisi peta.
     */
    public function destroy(int|string $edge): JsonResponse
    {
        try {
            $this->mapService->deleteEdge($edge);

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => 'Sisi peta']));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
