<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\WaliKelasRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\TransaksiBankMini;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Kwitansi digital siap cetak, hanya untuk transaksi settlement. Siswa hanya bisa membuka
 * miliknya, wali kelas hanya siswa di kelasnya, petugas bisa membuka semua.
 */
class KwitansiController extends Controller
{
    /**
     * Inisialisasi KwitansiController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     * @param  WaliKelasRepositoryInterface  $waliKelas
     */
    public function __construct(
        protected TransaksiBankMiniRepositoryInterface $transaksi,
        protected WaliKelasRepositoryInterface $waliKelas,
    ) {}

    /**
     * Kwitansi untuk siswa yang sedang login. Transaksi milik siswa lain menghasilkan 404.
     *
     * @param  Request  $request
     * @param  string  $orderId
     * @return View
     */
    public function siswa(Request $request, string $orderId): View
    {
        /** @var Siswa $siswa */
        $siswa = $request->user('siswa');

        return $this->tampil($this->transaksi->detailOrFail($orderId, $siswa->id), route('bank-mini.riwayat'));
    }

    /**
     * Kwitansi untuk petugas Bank Mini.
     *
     * @param  string  $orderId
     * @return View
     */
    public function admin(string $orderId): View
    {
        return $this->tampil($this->transaksi->detailOrFail($orderId), url()->previous(route('bank-mini.admin.laporan')));
    }

    /**
     * Kwitansi untuk wali kelas; transaksi siswa di luar kelasnya menghasilkan 404.
     *
     * @param  Request  $request
     * @param  string  $orderId
     * @return View
     */
    public function waliKelas(Request $request, string $orderId): View
    {
        $penautan = $this->waliKelas->findByUser((int) $request->user()?->id);
        $transaksi = $this->transaksi->detailOrFail($orderId);
        abort_unless($penautan && $transaksi->siswa?->kelas === $penautan->kelas, Response::HTTP_NOT_FOUND);

        return $this->tampil($transaksi, route('bank-mini.walas.riwayat'));
    }

    /**
     * Render kwitansi; transaksi yang belum settlement dianggap tidak ada.
     *
     * @param  TransaksiBankMini  $transaksi
     * @param  string  $kembali
     * @return View
     */
    private function tampil(TransaksiBankMini $transaksi, string $kembali): View
    {
        abort_unless($transaksi->isSettlement(), Response::HTTP_NOT_FOUND);

        return view('bank-mini.kwitansi', ['transaksi' => $transaksi, 'kembali' => $kembali]);
    }
}
