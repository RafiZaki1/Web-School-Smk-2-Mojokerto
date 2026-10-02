<?php

namespace App\Http\Controllers\Api\Admin;

use App\Contracts\Interfaces\AlumniServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Content\AlumniRequest;
use App\Http\Resources\AlumniResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AlumniController extends Controller
{
    public function __construct(
        protected AlumniServiceInterface $alumniService
    ) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success(AlumniResource::collection($this->alumniService->getList()), 'Lulusan berhasil dimuat');
    }

    public function store(AlumniRequest $request): JsonResponse
    {
        return ApiResponse::success(
            new AlumniResource($this->alumniService->create($request->validated())),
            'Lulusan berhasil disimpan',
            Response::HTTP_CREATED
        );
    }

    public function show(string $id): JsonResponse
    {
        return ApiResponse::success(new AlumniResource($this->alumniService->getById($id)), 'Lulusan berhasil dimuat');
    }

    public function update(AlumniRequest $request, string $id): JsonResponse
    {
        return ApiResponse::success(
            new AlumniResource($this->alumniService->update($id, $request->validated())),
            'Lulusan berhasil diperbarui'
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->alumniService->delete($id);

        return ApiResponse::success(null, 'Lulusan berhasil dihapus');
    }
}
