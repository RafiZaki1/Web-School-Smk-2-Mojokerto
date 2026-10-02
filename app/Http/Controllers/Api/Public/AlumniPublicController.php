<?php

namespace App\Http\Controllers\Api\Public;

use App\Contracts\Interfaces\AlumniServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\AlumniResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AlumniPublicController extends Controller
{
    public function __construct(
        protected AlumniServiceInterface $alumniService
    ) {}

    /** ?featured=1 untuk "Lulusan terbaik" di beranda. */
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::success(
            AlumniResource::collection($this->alumniService->getList($request->boolean('featured'))),
            'Lulusan berhasil dimuat'
        );
    }
}
