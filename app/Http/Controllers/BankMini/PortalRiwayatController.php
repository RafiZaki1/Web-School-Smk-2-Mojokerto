<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\SppBillingServiceInterface;
use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\TransaksiDetailBulanRepositoryInterface;
use App\Helpers\AcademicYearHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\BankMiniFilterRequest;
use App\Models\Siswa;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

/**
 * Riwayat transaksi dan Kartu SPP Digital siswa (halaman baca saja).
 */
class PortalRiwayatController extends Controller
{
    /**
     * Inisialisasi PortalRiwayatController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  TagihanSppRepositoryInterface  $tagihan
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     * @param  TransaksiDetailBulanRepositoryInterface  $detail
     * @param  SppBillingServiceInterface  $billing
     */
    public function __construct(
        protected TagihanSppRepositoryInterface $tagihan,
        protected TransaksiBankMiniRepositoryInterface $transaksi,
        protected TransaksiDetailBulanRepositoryInterface $detail,
        protected SppBillingServiceInterface $billing,
    ) {}

    /**
     * Daftar seluruh transaksi siswa, terbaru dulu.
     *
     * @param  Request  $request
     * @return View
     */
    public function riwayatTransaksi(Request $request): View
    {
        /** @var Siswa $siswa */
        $siswa = $request->user('siswa');

        return view('bank-mini.siswa.riwayat', [
            'siswa' => $siswa,
            'transaksi' => $this->transaksi->riwayatSiswa($siswa->id),
            'tahun' => AcademicYearHelper::current(),
            'opsiTahun' => $this->billing->pilihanTahun($this->tagihan->tahunAjaranSiswa($siswa->id)),
        ]);
    }

    /**
     * Detail satu transaksi: kode bayar/VA/QRIS, batas waktu, dan langkah pembayaran dari Tripay.
     * Juga menjadi return_url Tripay setelah siswa selesai membayar.
     *
     * @param  Request  $request
     * @param  string  $orderId
     * @return View
     */
    public function detailTransaksi(Request $request, string $orderId): View
    {
        /** @var Siswa $siswa */
        $siswa = $request->user('siswa');

        return view('bank-mini.siswa.transaksi', [
            'siswa' => $siswa,
            'transaksi' => $this->transaksi->detailOrFail($orderId, $siswa->id),
            'tahun' => AcademicYearHelper::current(),
            'opsiTahun' => [AcademicYearHelper::current()],
        ]);
    }

    /**
     * Kartu SPP Digital: 12 bulan beserta tanggal, metode, dan nomor transaksi pelunasan. Siap cetak.
     *
     * @param  BankMiniFilterRequest  $request
     * @return View
     */
    public function kartuSpp(BankMiniFilterRequest $request): View
    {
        /** @var Siswa $siswa */
        $siswa = $request->user('siswa');
        $tahun = $request->validated('tahun') ?? AcademicYearHelper::current();
        $tagihan = $this->tagihan->milikSiswa($siswa->id, $tahun);

        return view('bank-mini.siswa.kartu-spp', [
            'siswa' => $siswa,
            'tahun' => $tahun,
            'opsiTahun' => $this->billing->pilihanTahun($this->tagihan->tahunAjaranSiswa($siswa->id)),
            'tagihan' => $tagihan,
            'pelunasan' => $this->detail->pembayaranLunas($tagihan->pluck('id')->all()),
            'total' => $this->billing->hitungTotal($tagihan),
        ]);
    }
}
