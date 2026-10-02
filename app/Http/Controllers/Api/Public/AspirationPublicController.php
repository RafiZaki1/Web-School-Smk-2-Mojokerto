<?php

namespace App\Http\Controllers\Api\Public;

use App\Contracts\Interfaces\AspirationServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Content\StoreAspirationRequest;
use App\Http\Resources\AspirationPublicResource;
use App\Models\Aspiration;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AspirationPublicController extends Controller
{
    public function __construct(
        protected AspirationServiceInterface $aspirationService
    ) {}

    /** Contoh aspirasi yang sudah ditindaklanjuti (tanpa identitas pengirim). */
    public function index(): JsonResponse
    {
        return ApiResponse::success([
            'categories' => Aspiration::CATEGORIES,
            'items' => AspirationPublicResource::collection($this->aspirationService->getFollowedUp(6)),
        ], 'Aspirasi berhasil dimuat');
    }

    public function store(StoreAspirationRequest $request): JsonResponse
    {
        $aspiration = $this->aspirationService->submit($request->validated());

        return ApiResponse::success(
            ['id' => $aspiration->id],
            'Terima kasih! Aspirasimu sudah kami terima dan akan segera ditinjau.',
            Response::HTTP_CREATED
        );
    }
}
