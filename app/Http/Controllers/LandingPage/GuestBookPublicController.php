<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\GuestMessageServiceInterface;
use App\Contracts\Interfaces\GuestVisitServiceInterface;
use App\Enums\GuestMessageStatusEnum;
use App\Enums\GuestVisitStatusEnum;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\GuestMessageRequest;
use App\Http\Requests\GuestVisitRequest;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Buku Tamu Digital: pesan/pertanyaan pengunjung dan permohonan jadwal kunjungan instansi.
 * Respons tidak mengembalikan data yang dikirim agar isi buku tamu tidak bisa dibaca ulang.
 */
class GuestBookPublicController extends Controller
{
    /**
     * Inisialisasi GuestBookPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GuestMessageServiceInterface  $messages
     * @param  GuestVisitServiceInterface  $visits
     */
    public function __construct(
        protected GuestMessageServiceInterface $messages,
        protected GuestVisitServiceInterface $visits,
    ) {}

    /**
     * Simpan pesan dari pengunjung website.
     *
     * @param  GuestMessageRequest  $request
     * @return JsonResponse
     */
    public function storeMessage(GuestMessageRequest $request): JsonResponse
    {
        try {
            $this->messages->create([...$request->validated(), 'status' => GuestMessageStatusEnum::NEW->value]);

            return ResponseHelper::success(null, trans('alert.guest_message_sent'), Response::HTTP_CREATED);
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Simpan permohonan jadwal kunjungan tamu instansi.
     *
     * @param  GuestVisitRequest  $request
     * @return JsonResponse
     */
    public function storeVisit(GuestVisitRequest $request): JsonResponse
    {
        try {
            $this->visits->create([...$request->validated(), 'status' => GuestVisitStatusEnum::SCHEDULED->value]);

            return ResponseHelper::success(null, trans('alert.guest_visit_sent'), Response::HTTP_CREATED);
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
