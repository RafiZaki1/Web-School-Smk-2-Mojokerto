<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\SiteContentRepositoryInterface;
use App\Helpers\AcademicYearHelper;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StatusLayananRequest;
use App\Services\BankMini\StatusLayananService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Throwable;

/**
 * Petugas dan admin membuka atau menutup portal siswa Bank Mini.
 */
class AdminStatusLayananController extends Controller
{
    /**
     * Inisialisasi AdminStatusLayananController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SiteContentRepositoryInterface  $konten
     * @param  StatusLayananService  $layanan
     */
    public function __construct(
        protected SiteContentRepositoryInterface $konten,
        protected StatusLayananService $layanan,
    ) {}

    /**
     * Halaman pengaturan status layanan.
     *
     * @return View
     */
    public function index(): View
    {
        return view('bank-mini.admin.status-layanan', [
            'status' => $this->layanan->baca(),
            'tahun' => AcademicYearHelper::current(),
            'opsiTahun' => [AcademicYearHelper::current()],
        ]);
    }

    /**
     * Simpan status buka/tutup. Hanya tabel site_contents yang berubah.
     *
     * @param  StatusLayananRequest  $request
     * @return JsonResponse
     */
    public function simpan(StatusLayananRequest $request): JsonResponse
    {
        $tutup = $request->boolean('tutup');

        try {
            $this->konten->upsert(
                StatusLayananService::KUNCI,
                $this->layanan->payload($tutup, $request->validated('pesan'), $request->user()?->name),
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }

        return ResponseHelper::success($this->layanan->baca(), trans($tutup ? 'alert.spp_service_closed_saved' : 'alert.spp_service_opened_saved'));
    }
}
