<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\RoomCategoryServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomCategoryRequest;
use App\Http\Requests\UpdateRoomCategoryRequest;
use App\Http\Resources\RoomCategoryResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AdminRoomCategoryController extends Controller
{
    /**
     * Inisialisasi AdminRoomCategoryController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected RoomCategoryServiceInterface $roomCategoryService
    ) {}

    /**
     * Tampilkan seluruh kategori ruangan.
     */
    public function index(): JsonResponse
    {
        return ResponseHelper::success(
            RoomCategoryResource::collection($this->roomCategoryService->getAll()),
            trans('alert.fetch_success', ['resource' => 'Kategori ruangan'])
        );
    }

    /**
     * Simpan kategori ruangan baru.
     */
    public function store(StoreRoomCategoryRequest $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new RoomCategoryResource($this->roomCategoryService->create($request->validated())),
                trans('alert.add_success', ['resource' => 'Kategori ruangan']),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan satu kategori ruangan.
     */
    public function show(int|string $room_category): JsonResponse
    {
        return ResponseHelper::success(
            new RoomCategoryResource($this->roomCategoryService->getById($room_category)),
            trans('alert.fetch_success', ['resource' => 'Kategori ruangan'])
        );
    }

    /**
     * Perbarui kategori ruangan.
     */
    public function update(UpdateRoomCategoryRequest $request, int|string $room_category): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new RoomCategoryResource($this->roomCategoryService->update($room_category, $request->validated())),
                trans('alert.update_success', ['resource' => 'Kategori ruangan'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus kategori ruangan.
     */
    public function destroy(int|string $room_category): JsonResponse
    {
        try {
            $this->roomCategoryService->delete($room_category);

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => 'Kategori ruangan']));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
