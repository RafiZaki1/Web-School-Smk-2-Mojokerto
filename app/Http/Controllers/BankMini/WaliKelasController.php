<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\LaporanKasRepositoryInterface;
use App\Contracts\Interfaces\MonitoringKelasServiceInterface;
use App\Contracts\Interfaces\SiswaRepositoryInterface;
use App\Contracts\Interfaces\SppBillingServiceInterface;
use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\WaliKelasRepositoryInterface;
use App\Helpers\AcademicYearHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\BankMiniFilterRequest;
use App\Models\WaliKelas;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Portal wali kelas: memantau pembayaran SPP kelasnya sendiri (baca saja).
 */
class WaliKelasController extends Controller
{
    /**
     * Inisialisasi WaliKelasController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  WaliKelasRepositoryInterface  $waliKelas
     * @param  SiswaRepositoryInterface  $siswa
     * @param  TagihanSppRepositoryInterface  $tagihan
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     * @param  LaporanKasRepositoryInterface  $laporan
     * @param  SppBillingServiceInterface  $billing
     * @param  MonitoringKelasServiceInterface  $monitoring
     */
    public function __construct(
        protected WaliKelasRepositoryInterface $waliKelas,
        protected SiswaRepositoryInterface $siswa,
        protected TagihanSppRepositoryInterface $tagihan,
        protected TransaksiBankMiniRepositoryInterface $transaksi,
        protected LaporanKasRepositoryInterface $laporan,
        protected SppBillingServiceInterface $billing,
        protected MonitoringKelasServiceInterface $monitoring,
    ) {}

    /**
     * Dasbor kelas: ringkasan dan matriks 12 bulan siswa di kelas wali, bisa disaring status lunas.
     *
     * @param  BankMiniFilterRequest  $request
     * @return View
     */
    public function dashboard(BankMiniFilterRequest $request): View
    {
        $penautan = $this->penautan($request);
        $tahun = $request->validated('tahun') ?? AcademicYearHelper::current();
        $siswa = $this->siswa->aktifPerKelas($penautan->kelas);
        $ids = $siswa->pluck('id')->all();
        $matriks = $this->billing->matriksKelas($siswa, $this->tagihan->milikBanyakSiswa($ids, $tahun), $this->transaksi->tabunganPerSiswa($ids));

        return view('bank-mini.walas.dashboard', [
            'penautan' => $penautan,
            'kelas' => $penautan->kelas,
            'tahun' => $tahun,
            'opsiTahun' => $this->billing->pilihanTahun($this->tagihan->tahunAjaranTersedia()),
            'rekapKelas' => $this->tagihan->rekapPerKelas($tahun)->get($penautan->kelas),
            'matriks' => $matriks,
            'matriksTampil' => $this->monitoring->saringMatriks($matriks, $request->validated('status')),
            'status' => $request->validated('status'),
        ]);
    }

    /**
     * Riwayat pembayaran (tunai maupun online) siswa di kelas wali, terbaru dulu.
     *
     * @param  Request  $request
     * @return View
     */
    public function riwayat(Request $request): View
    {
        $penautan = $this->penautan($request);

        return view('bank-mini.walas.riwayat', [
            'penautan' => $penautan,
            'kelas' => $penautan->kelas,
            'transaksi' => $this->laporan->transaksiKelas($penautan->kelas),
            'tahun' => AcademicYearHelper::current(),
        ]);
    }

    /**
     * Kelas milik wali yang sedang login; 403 bila akun belum ditautkan.
     *
     * @param  Request  $request
     * @return WaliKelas
     */
    private function penautan(Request $request): WaliKelas
    {
        $penautan = $this->waliKelas->findByUser((int) $request->user()?->id);
        abort_unless($penautan !== null, Response::HTTP_FORBIDDEN, trans('alert.walas_not_assigned'));

        return $penautan;
    }
}
