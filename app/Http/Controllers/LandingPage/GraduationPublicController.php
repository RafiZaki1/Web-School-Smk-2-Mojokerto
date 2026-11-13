<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\GraduationServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\GraduationCheckRequest;
use App\Http\Resources\GraduationResultResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Halaman Cek Kelulusan: status rilis (hitung mundur) dan cek NISN + nama lengkap.
 */
class GraduationPublicController extends Controller
{
    /**
     * Inisialisasi GraduationPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GraduationServiceInterface  $graduation
     */
    public function __construct(
        protected GraduationServiceInterface $graduation,
    ) {}

    /**
     * Status pengumuman: draft, hitung mundur, atau terbuka.
     *
     * @return JsonResponse
     */
    public function status(): JsonResponse
    {
        return ResponseHelper::success($this->graduation->publicStatus(), trans('alert.fetch_success', ['resource' => 'Status pengumuman']));
    }

    /**
     * Cek kelulusan dengan NISN dan tanggal lahir. Ditolak selama pengumuman belum dibuka.
     *
     * @param  GraduationCheckRequest  $request
     * @return JsonResponse
     */
    public function check(GraduationCheckRequest $request): JsonResponse
    {
        if (! $this->graduation->isOpen()) {
            return ResponseHelper::error(null, trans('alert.graduation_closed'), Response::HTTP_FORBIDDEN);
        }

        $graduate = $this->graduation->check($request->validated('nisn'), $request->validated('full_name'));

        if (! $graduate) {
            return ResponseHelper::error(null, trans('alert.graduation_not_found'), Response::HTTP_NOT_FOUND);
        }

        return ResponseHelper::success(GraduationResultResource::make($graduate), trans('alert.fetch_success', ['resource' => 'Hasil kelulusan']));
    }
}
