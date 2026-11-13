<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\MapRoutingServiceInterface;
use App\Contracts\Interfaces\MapServiceInterface;
use App\Contracts\Interfaces\RoomCategoryServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\RouteRequest;
use App\Http\Resources\MapNodeResource;
use App\Http\Resources\MapRouteResource;
use App\Http\Resources\RoomCategoryResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use InvalidArgumentException;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class MapPublicController extends Controller
{
    /**
     * Inisialisasi MapPublicController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MapRoutingServiceInterface $mapRoutingService,
        protected MapServiceInterface $mapService,
        protected RoomCategoryServiceInterface $roomCategoryService,
    ) {}

    /**
     * Hitung rute jalan kaki dari ruangan asal ke ruangan tujuan.
     */
    public function route(RouteRequest $request): JsonResponse
    {
        try {
            $result = $this->mapRoutingService->calculateRoute($request->input('from'), $request->input('to'));

            return ResponseHelper::success(
                new MapRouteResource($result),
                trans('alert.route_calculated')
            );
        } catch (ModelNotFoundException) {
            return ResponseHelper::error(null, trans('alert.room_not_found'), Response::HTTP_NOT_FOUND);
        } catch (InvalidArgumentException $th) {
            return ResponseHelper::error(null, $th->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (RuntimeException $th) {
            return ResponseHelper::error(null, $th->getMessage(), Response::HTTP_BAD_REQUEST);
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan kategori ruangan yang aktif.
     */
    public function categories(): JsonResponse
    {
        return ResponseHelper::success(
            RoomCategoryResource::collection($this->roomCategoryService->getActive()),
            trans('alert.fetch_success', ['resource' => 'Kategori ruangan'])
        );
    }

    /**
     * Tampilkan titik peta yang dapat dilalui untuk lapisan denah interaktif.
     */
    public function nodes(): JsonResponse
    {
        return ResponseHelper::success(
            MapNodeResource::collection($this->mapService->getWalkableNodes()),
            trans('alert.fetch_success', ['resource' => 'Titik peta'])
        );
    }
}
