<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\AlumniServiceRequestServiceInterface;
use App\Helpers\DeviceTokenHelper;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAlumniServiceRequest;
use App\Http\Resources\AlumniServiceTrackResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Form layanan berkas alumni tanpa login. Pengajuan diikat ke token perangkat (header X-Device-Token)
 * sehingga status dan lonceng hanya terlihat di perangkat yang mengajukan.
 */
class AlumniServicePublicController extends Controller
{
    /**
     * Inisialisasi AlumniServicePublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  AlumniServiceRequestServiceInterface  $service
     */
    public function __construct(protected AlumniServiceRequestServiceInterface $service) {}

    /**
     * Simpan pengajuan baru beserta notifikasi "Pengajuan diterima" (dua tabel, jadi pakai transaksi).
     *
     * @param  StoreAlumniServiceRequest  $request
     * @return JsonResponse
     */
    public function store(StoreAlumniServiceRequest $request): JsonResponse
    {
        $deviceToken = DeviceTokenHelper::require($request);

        DB::beginTransaction();
        try {
            $serviceRequest = $this->service->submit($request->validated(), $deviceToken);
            DB::commit();

            return ResponseHelper::success(
                AlumniServiceTrackResource::make($serviceRequest->refresh()),
                trans('alert.alumni_service_submitted', ['ticket' => $serviceRequest->ticket_code]),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            DB::rollBack();

            return $this->writeError($th);
        }
    }

    /**
     * Daftar pengajuan milik perangkat ini.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function device(Request $request): JsonResponse
    {
        return ResponseHelper::success(
            AlumniServiceTrackResource::collection($this->service->forDevice(DeviceTokenHelper::require($request))),
            trans('alert.fetch_success', ['resource' => 'Pengajuan layanan'])
        );
    }
}
