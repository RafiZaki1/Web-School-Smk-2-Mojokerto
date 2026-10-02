<?php

namespace App\Http\Controllers\Api\Admin;

use App\Contracts\Interfaces\AspirationServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Content\RespondAspirationRequest;
use App\Http\Resources\AspirationResource;
use Illuminate\Http\JsonResponse;

class AspirationController extends Controller
{
    public function __construct(
        protected AspirationServiceInterface $aspirationService
    ) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success([
            'counts' => $this->aspirationService->statusCounts(),
            'items' => AspirationResource::collection($this->aspirationService->getAll()),
        ], 'Aspirasi berhasil dimuat');
    }

    public function show(string $id): JsonResponse
    {
        return ApiResponse::success(new AspirationResource($this->aspirationService->getById($id)), 'Aspirasi berhasil dimuat');
    }

    /** Ubah status & catatan tindak lanjut. */
    public function update(RespondAspirationRequest $request, string $id): JsonResponse
    {
        return ApiResponse::success(
            new AspirationResource($this->aspirationService->respond($id, $request->validated())),
            'Status aspirasi berhasil diperbarui'
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->aspirationService->delete($id);

        return ApiResponse::success(null, 'Aspirasi berhasil dihapus');
    }
}
