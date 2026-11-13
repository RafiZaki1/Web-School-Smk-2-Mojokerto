<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\RoomServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\RoomSearchRequest;
use App\Http\Resources\FacilityResource;
use App\Http\Resources\RoomDetailResource;
use App\Http\Resources\RoomResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class RoomPublicController extends Controller
{
    /**
     * Inisialisasi RoomPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  RoomServiceInterface  $roomService
     */
    public function __construct(
        protected RoomServiceInterface $roomService
    ) {}

    /**
     * Tampilkan seluruh ruangan yang aktif.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            return ResponseHelper::success(
                RoomResource::collection($this->roomService->getActiveRooms()),
                trans('alert.fetch_success', ['resource' => 'Ruangan'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan detail satu ruangan.
     *
     * @param  int|string  $room
     * @return JsonResponse
     */
    public function show(int|string $room): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new RoomDetailResource($this->roomService->getRoomDetail($room)),
                trans('alert.fetch_success', ['resource' => 'Detail ruangan'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan fasilitas milik satu ruangan.
     *
     * @param  int|string  $room
     * @return JsonResponse
     */
    public function facilities(int|string $room): JsonResponse
    {
        try {
            return ResponseHelper::success(
                FacilityResource::collection($this->roomService->getRoomFacilities($room)),
                trans('alert.fetch_success', ['resource' => 'Fasilitas'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Cari ruangan berdasarkan kata kunci.
     *
     * @param  RoomSearchRequest  $request
     * @return JsonResponse
     */
    public function search(RoomSearchRequest $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                RoomResource::collection($this->roomService->searchRooms($request->validated('q'))),
                trans('alert.fetch_success', ['resource' => 'Hasil pencarian ruangan'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
