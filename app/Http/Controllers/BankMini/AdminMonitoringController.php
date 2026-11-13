<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\LaporanKasRepositoryInterface;
use App\Contracts\Interfaces\MonitoringKelasServiceInterface;
use App\Contracts\Interfaces\SiswaRepositoryInterface;
use App\Contracts\Interfaces\SppBillingServiceInterface;
use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\WaliKelasRepositoryInterface;
use App\Enums\MajorCodeEnum;
use App\Enums\SchoolClassEnum;
use App\Helpers\AcademicYearHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\BankMiniFilterRequest;
use Illuminate\Contracts\View\View;

/**
 * Monitoring pembayaran petugas: rekap semua kelas (filter jurusan & status lunas)
 * atau matriks 12 bulan satu kelas (filter status lunas siswa).
 */
class AdminMonitoringController extends Controller
{
    /**
     * Inisialisasi AdminMonitoringController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SiswaRepositoryInterface  $siswa
     * @param  TagihanSppRepositoryInterface  $tagihan
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     * @param  LaporanKasRepositoryInterface  $laporan
     * @param  WaliKelasRepositoryInterface  $waliKelas
     * @param  SppBillingServiceInterface  $billing
     * @param  MonitoringKelasServiceInterface  $monitoring
     */
    public function __construct(
        protected SiswaRepositoryInterface $siswa,
        protected TagihanSppRepositoryInterface $tagihan,
        protected TransaksiBankMiniRepositoryInterface $transaksi,
        protected LaporanKasRepositoryInterface $laporan,
        protected WaliKelasRepositoryInterface $waliKelas,
        protected SppBillingServiceInterface $billing,
        protected MonitoringKelasServiceInterface $monitoring,
    ) {}

    /**
     * Tanpa kelas: tabel rekap per kelas yang bisa disaring jurusan dan status lunas.
     * Dengan kelas: ringkasan dan matriks siswa kelas itu, disaring status lunas siswa.
     *
     * @param  BankMiniFilterRequest  $request
     * @return View
     */
    public function index(BankMiniFilterRequest $request): View
    {
        $tahun = $request->validated('tahun') ?? AcademicYearHelper::current();
        $kelas = $request->validated('kelas');
        $jurusan = $request->validated('jurusan');
        $status = $request->validated('status');
        $rekap = $this->tagihan->rekapPerKelas($tahun);
        $wali = $this->waliKelas->semuaPerKelas();

        $data = [
            'tahun' => $tahun,
            'kelas' => $kelas,
            'jurusan' => $jurusan,
            'status' => $status,
            'opsiTahun' => $this->billing->pilihanTahun($this->tagihan->tahunAjaranTersedia()),
            'opsiKelas' => $jurusan
                ? array_map(fn (SchoolClassEnum $k) => $k->value, MajorCodeEnum::from($jurusan)->classes())
                : SchoolClassEnum::values(),
        ];

        if ($kelas === null) {
            $semua = $this->monitoring->rekapKelas(SchoolClassEnum::values(), $rekap, $this->siswa->jumlahAktifPerKelas(), $this->laporan->tabunganPerKelas(), $wali);
            $baris = $this->monitoring->saringRekap($semua, $jurusan, $status);

            return view('bank-mini.admin.monitoring', $data + ['baris' => $baris, 'ringkasan' => $this->monitoring->ringkasan($baris)]);
        }

        $siswa = $this->siswa->aktifPerKelas($kelas);
        $ids = $siswa->pluck('id')->all();
        $matriks = $this->billing->matriksKelas($siswa, $this->tagihan->milikBanyakSiswa($ids, $tahun), $this->transaksi->tabunganPerSiswa($ids));

        return view('bank-mini.admin.monitoring', $data + [
            'matriks' => $matriks,
            'matriksTampil' => $this->monitoring->saringMatriks($matriks, $status),
            'rekapKelas' => $rekap->get($kelas),
            'wali' => $wali->get($kelas),
        ]);
    }
}
