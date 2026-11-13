<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\SchoolProfileServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\SchoolProfileResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class SchoolProfilePublicController extends Controller
{
    /**
     * Inisialisasi SchoolProfilePublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SchoolProfileServiceInterface  $schoolProfileService
     */
    public function __construct(
        protected SchoolProfileServiceInterface $schoolProfileService
    ) {}

    /**
     * Tampilkan profil sekolah untuk halaman publik.
     *
     * @return JsonResponse
     */
    public function show(): JsonResponse
    {
        try {
            $profile = $this->schoolProfileService->getProfile();

            return ResponseHelper::success(
                $profile ? new SchoolProfileResource($profile) : null,
                trans('alert.fetch_success', ['resource' => 'Profil sekolah'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
