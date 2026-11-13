<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\HeroServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHeroRequest;
use App\Http\Requests\UpdateHeroRequest;
use App\Http\Resources\HeroResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class HeroController extends Controller
{
    /**
     * Inisialisasi HeroController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected HeroServiceInterface $heroService
    ) {}

    /**
     * Tampilkan seluruh banner beranda.
     */
    public function index(): JsonResponse
    {
        return ResponseHelper::success(
            HeroResource::collection($this->heroService->getAll()),
            trans('alert.fetch_success', ['resource' => 'Banner'])
        );
    }

    /**
     * Simpan banner beranda baru.
     */
    public function store(StoreHeroRequest $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new HeroResource($this->heroService->create($request->validated())),
                trans('alert.add_success', ['resource' => 'Banner']),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan satu banner beranda.
     */
    public function show(string $id): JsonResponse
    {
        return ResponseHelper::success(
            new HeroResource($this->heroService->getById($id)),
            trans('alert.fetch_success', ['resource' => 'Banner'])
        );
    }

    /**
     * Perbarui banner beranda.
     */
    public function update(UpdateHeroRequest $request, string $id): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new HeroResource($this->heroService->update($id, $request->validated())),
                trans('alert.update_success', ['resource' => 'Banner'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus banner beranda beserta gambarnya.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->heroService->delete($id);

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => 'Banner']));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
