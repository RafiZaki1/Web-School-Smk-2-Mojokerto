<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\RoomServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Http\Resources\RoomDetailResource;
use App\Http\Resources\RoomResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AdminRoomController extends Controller
{
    /**
     * Inisialisasi AdminRoomController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected RoomServiceInterface $roomService
    ) {}

    /**
     * Tampilkan seluruh ruangan untuk admin.
     */
    public function index(): JsonResponse
    {
        return ResponseHelper::success(
            RoomResource::collection($this->roomService->getAllAdminRooms()),
            trans('alert.fetch_success', ['resource' => 'Ruangan'])
        );
    }

    /**
     * Simpan ruangan baru.
     */
    public function store(StoreRoomRequest $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new RoomDetailResource($this->roomService->createRoom($request->validated())),
                trans('alert.add_success', ['resource' => 'Ruangan']),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan detail ruangan berdasarkan id atau slug.
     */
    public function show(int|string $id): JsonResponse
    {
        return ResponseHelper::success(
            new RoomDetailResource($this->roomService->getRoomDetail($id)),
            trans('alert.fetch_success', ['resource' => 'Ruangan'])
        );
    }

    /**
     * Perbarui ruangan.
     */
    public function update(UpdateRoomRequest $request, int|string $id): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new RoomDetailResource($this->roomService->updateRoom($id, $request->validated())),
                trans('alert.update_success', ['resource' => 'Ruangan'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus ruangan bersama fasilitasnya dalam satu transaksi.
     */
    public function destroy(int|string $id): JsonResponse
    {
        DB::beginTransaction();

        try {
            $this->roomService->deleteRoom($id);

            DB::commit();

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => 'Ruangan']));
        } catch (Throwable $th) {
            DB::rollBack();

            return $this->writeError($th);
        }
    }
}
