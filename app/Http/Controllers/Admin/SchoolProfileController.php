<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\SchoolProfileServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSchoolProfileRequest;
use App\Http\Resources\SchoolProfileResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class SchoolProfileController extends Controller
{
    /**
     * Inisialisasi SchoolProfileController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected SchoolProfileServiceInterface $schoolProfileService
    ) {}

    /**
     * Tampilkan profil sekolah.
     */
    public function show(): JsonResponse
    {
        $profile = $this->schoolProfileService->getProfile();

        return ResponseHelper::success(
            $profile ? new SchoolProfileResource($profile) : null,
            trans('alert.fetch_success', ['resource' => 'Profil sekolah'])
        );
    }

    /**
     * Perbarui profil sekolah, atau buat baru bila belum ada.
     */
    public function update(UpdateSchoolProfileRequest $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new SchoolProfileResource($this->schoolProfileService->updateProfile($request->validated())),
                trans('alert.update_success', ['resource' => 'Profil sekolah'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
