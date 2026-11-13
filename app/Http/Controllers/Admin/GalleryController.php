<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\GalleryServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGalleryRequest;
use App\Http\Requests\UpdateGalleryRequest;
use App\Http\Resources\GalleryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class GalleryController extends Controller
{
    /**
     * Inisialisasi GalleryController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected GalleryServiceInterface $galleryService
    ) {}

    /**
     * Tampilkan seluruh foto galeri, opsional difilter per kategori.
     */
    public function index(Request $request): JsonResponse
    {
        return ResponseHelper::success(
            GalleryResource::collection($this->galleryService->getAll($request->query('category'))),
            trans('alert.fetch_success', ['resource' => 'Galeri'])
        );
    }

    /**
     * Simpan foto galeri baru.
     */
    public function store(StoreGalleryRequest $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new GalleryResource($this->galleryService->create($request->validated())),
                trans('alert.add_success', ['resource' => 'Galeri']),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan satu foto galeri.
     */
    public function show(string $id): JsonResponse
    {
        return ResponseHelper::success(
            new GalleryResource($this->galleryService->getById($id)),
            trans('alert.fetch_success', ['resource' => 'Galeri'])
        );
    }

    /**
     * Perbarui foto galeri.
     */
    public function update(UpdateGalleryRequest $request, string $id): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new GalleryResource($this->galleryService->update($id, $request->validated())),
                trans('alert.update_success', ['resource' => 'Galeri'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus foto galeri beserta gambarnya.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->galleryService->delete($id);

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => 'Galeri']));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
