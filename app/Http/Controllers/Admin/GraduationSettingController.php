<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\GraduationServiceInterface;
use App\Enums\GraduationReleaseModeEnum;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\GraduationSettingRequest;
use App\Http\Resources\GraduationSettingResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class GraduationSettingController extends Controller
{
    private const LABEL = 'Pengaturan kelulusan';

    /**
     * Inisialisasi GraduationSettingController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GraduationServiceInterface  $service
     */
    public function __construct(protected GraduationServiceInterface $service) {}

    /**
     * Tampilkan pengaturan pengumuman kelulusan beserta status halaman publik saat ini.
     *
     * @return JsonResponse
     */
    public function show(): JsonResponse
    {
        return ResponseHelper::success([
            'setting' => GraduationSettingResource::make($this->service->settings()),
            'public_status' => $this->service->publicStatus(),
        ], trans('alert.fetch_success', ['resource' => self::LABEL]));
    }

    /**
     * Simpan perubahan pengaturan (auto-save per kolom). Mode Timer wajib punya waktu rilis.
     *
     * @param  GraduationSettingRequest  $request
     * @return JsonResponse
     */
    public function update(GraduationSettingRequest $request): JsonResponse
    {
        $data = $request->validated();
        $current = $this->service->settings();
        $mode = $data['release_mode'] ?? $current->release_mode;
        $releaseAt = array_key_exists('release_at', $data) ? $data['release_at'] : $current->release_at;

        if ($mode === GraduationReleaseModeEnum::TIMER->value && ! $releaseAt) {
            return ResponseHelper::error(['release_at' => [trans('alert.release_at_required')]], trans('alert.validation_failed'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $setting = $this->service->updateSettings($data);

            return ResponseHelper::success([
                'setting' => GraduationSettingResource::make($setting),
                'public_status' => $this->service->publicStatus(),
            ], trans('alert.update_success', ['resource' => self::LABEL]));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
