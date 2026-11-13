<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\RoomServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFacilityRequest;
use App\Http\Requests\UpdateFacilityRequest;
use App\Http\Resources\FacilityResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AdminFacilityController extends Controller
{
    /**
     * Inisialisasi AdminFacilityController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected RoomServiceInterface $roomService
    ) {}

    /**
     * Tampilkan fasilitas milik ruangan tertentu.
     */
    public function index(int|string $room): JsonResponse
    {
        return ResponseHelper::success(
            FacilityResource::collection($this->roomService->getRoomFacilities($room)),
            trans('alert.fetch_success', ['resource' => 'Fasilitas'])
        );
    }

    /**
     * Tambahkan fasilitas ke ruangan.
     */
    public function store(StoreFacilityRequest $request, int|string $room): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new FacilityResource($this->roomService->addFacility($room, $request->validated())),
                trans('alert.add_success', ['resource' => 'Fasilitas']),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Perbarui fasilitas pada ruangan.
     */
    public function update(UpdateFacilityRequest $request, int|string $room, int|string $facility): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new FacilityResource($this->roomService->updateFacility($room, $facility, $request->validated())),
                trans('alert.update_success', ['resource' => 'Fasilitas'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus fasilitas dari ruangan.
     */
    public function destroy(int|string $room, int|string $facility): JsonResponse
    {
        try {
            $this->roomService->deleteFacility($room, $facility);

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => 'Fasilitas']));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
