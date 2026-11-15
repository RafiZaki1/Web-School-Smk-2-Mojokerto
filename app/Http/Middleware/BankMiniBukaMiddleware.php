<?php

namespace App\Http\Middleware;

use App\Helpers\ResponseHelper;
use App\Services\BankMini\StatusLayananService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Saat petugas menutup layanan, seluruh portal siswa (login, dasbor, checkout, riwayat)
 * diganti halaman pengumuman tutup. Panel petugas, wali kelas, dan callback Tripay tidak
 * terpengaruh, jadi pembayaran yang sudah telanjur dibuat tetap tercatat.
 */
class BankMiniBukaMiddleware
{
    /**
     * Inisialisasi middleware dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  StatusLayananService  $layanan
     */
    public function __construct(
        protected StatusLayananService $layanan,
    ) {}

    /**
     * Teruskan request bila layanan buka; selain itu tampilkan pengumuman tutup (503).
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $status = $this->layanan->baca();

        if (! $status['tutup']) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return ResponseHelper::error(null, $status['pesan'] ?? trans('alert.spp_service_closed'), Response::HTTP_SERVICE_UNAVAILABLE);
        }

        return response()->view('bank-mini.tutup', ['status' => $status], Response::HTTP_SERVICE_UNAVAILABLE);
    }
}
