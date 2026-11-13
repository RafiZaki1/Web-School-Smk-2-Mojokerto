<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\AlumniServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\AlumniResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AlumniPublicController extends Controller
{
    /**
     * Inisialisasi AlumniPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  AlumniServiceInterface  $alumniService
     */
    public function __construct(
        protected AlumniServiceInterface $alumniService
    ) {}

    /**
     * Tampilkan daftar lulusan. Parameter featured=1 hanya menampilkan lulusan terbaik untuk beranda.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                AlumniResource::collection($this->alumniService->getList($request->boolean('featured'))),
                trans('alert.fetch_success', ['resource' => 'Lulusan'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
