<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\NotifikasiBankMiniRepositoryInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotifikasiBankMiniResource;
use Illuminate\Http\JsonResponse;
use Throwable;

/**
 * Lonceng notifikasi pembayaran online di panel petugas Bank Mini.
 * Halaman memanggil index() berkala, jadi pembayaran baru muncul tanpa muat ulang.
 */
class AdminNotifikasiController extends Controller
{
    /**
     * Inisialisasi AdminNotifikasiController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  NotifikasiBankMiniRepositoryInterface  $notifikasi
     */
    public function __construct(
        protected NotifikasiBankMiniRepositoryInterface $notifikasi,
    ) {}

    /**
     * Daftar notifikasi terbaru dan jumlah yang belum dibaca.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return ResponseHelper::success([
            'belum_dibaca' => $this->notifikasi->jumlahBelumDibaca(),
            'items' => NotifikasiBankMiniResource::collection($this->notifikasi->terbaru()),
        ], trans('alert.fetch_success', ['resource' => 'Notifikasi']));
    }

    /**
     * Tandai semua notifikasi sudah dibaca.
     *
     * @return JsonResponse
     */
    public function bacaSemua(): JsonResponse
    {
        try {
            $jumlah = $this->notifikasi->tandaiSemuaDibaca();
        } catch (Throwable $th) {
            return $this->writeError($th);
        }

        return ResponseHelper::success(['ditandai' => $jumlah], trans('alert.spp_notifications_read'));
    }
}
