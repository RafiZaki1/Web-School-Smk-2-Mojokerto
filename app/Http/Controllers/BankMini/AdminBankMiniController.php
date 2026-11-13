<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\BankMiniTransaksiServiceInterface;
use App\Contracts\Interfaces\LaporanKasRepositoryInterface;
use App\Contracts\Interfaces\SiswaRepositoryInterface;
use App\Contracts\Interfaces\SppBillingServiceInterface;
use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\TransaksiDetailBulanRepositoryInterface;
use App\Enums\BankMini\MetodeBayarEnum;
use App\Enums\SchoolClassEnum;
use App\Exceptions\BankMini\TagihanTidakTersediaException;
use App\Helpers\AcademicYearHelper;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\BankMiniFilterRequest;
use App\Http\Requests\BayarTunaiRequest;
use App\Http\Requests\GenerateTagihanRequest;
use App\Http\Resources\TransaksiBankMiniResource;
use App\Models\Siswa;
use App\Models\TransaksiBankMini;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Panel petugas Bank Mini: bayar tunai, generate tagihan, dan laporan kas. Monitoring ada di AdminMonitoringController.
 */
class AdminBankMiniController extends Controller
{
    /**
     * Inisialisasi AdminBankMiniController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SiswaRepositoryInterface  $siswa
     * @param  TagihanSppRepositoryInterface  $tagihan
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     * @param  TransaksiDetailBulanRepositoryInterface  $detail
     * @param  SppBillingServiceInterface  $billing
     * @param  BankMiniTransaksiServiceInterface  $transaksiService
     * @param  LaporanKasRepositoryInterface  $laporan
     */
    public function __construct(
        protected SiswaRepositoryInterface $siswa,
        protected TagihanSppRepositoryInterface $tagihan,
        protected TransaksiBankMiniRepositoryInterface $transaksi,
        protected TransaksiDetailBulanRepositoryInterface $detail,
        protected SppBillingServiceInterface $billing,
        protected BankMiniTransaksiServiceInterface $transaksiService,
        protected LaporanKasRepositoryInterface $laporan,
    ) {}

    /**
     * Halaman pembuatan tagihan 12 bulan.
     *
     * @return View
     */
    public function halamanTagihan(): View
    {
        return view('bank-mini.admin.generate-tagihan', [
            'tahun' => AcademicYearHelper::current(),
            'opsiTahun' => $this->billing->pilihanTahun($this->tagihan->tahunAjaranTersedia()),
            'daftarKelas' => SchoolClassEnum::values(),
            'jumlahSiswa' => $this->siswa->count(['is_active' => true]),
        ]);
    }

    /**
     * Buat tagihan Juli-Juni untuk siswa aktif (semua kelas atau satu kelas). Hanya tabel
     * tagihan_spp yang berubah, dan bulan yang sudah ada dilewati unique index.
     *
     * @param  GenerateTagihanRequest  $request
     * @return JsonResponse
     */
    public function generateTagihan(GenerateTagihanRequest $request): JsonResponse
    {
        $ids = $this->siswa->idsAktif($request->validated('kelas'));

        if ($ids === []) {
            return ResponseHelper::error(null, trans('alert.spp_no_students'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $dibuat = $this->tagihan->insertIgnore($this->billing->susunTagihan($ids, $request->validated('tahun_ajaran')));

            return ResponseHelper::success(
                ['dibuat' => $dibuat, 'siswa' => count($ids)],
                trans('alert.spp_bills_generated', ['created' => $dibuat, 'students' => count($ids)]),
                Response::HTTP_CREATED,
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Catat pembayaran tunai di loket: bulan langsung lunas dan transaksi langsung settlement.
     * Tiga tabel berubah, jadi dibungkus DB transaction.
     *
     * @param  BayarTunaiRequest  $request
     * @return JsonResponse
     */
    public function bayarTunai(BayarTunaiRequest $request): JsonResponse
    {
        /** @var Siswa $siswa */
        $siswa = $this->siswa->findOrFail($request->validated('siswa_id'));
        $ids = array_map('intval', $request->validated('tagihan_ids'));
        $tagihan = $this->tagihan->bisaDibayar($ids, $siswa->id);

        if ($tagihan->count() !== count($ids)) {
            return ResponseHelper::error(null, trans('alert.spp_months_unavailable'), Response::HTTP_CONFLICT);
        }

        DB::beginTransaction();
        try {
            if ($this->tagihan->lunasiTunai($ids, $siswa->id) !== count($ids)) {
                throw new TagihanTidakTersediaException;
            }

            /** @var TransaksiBankMini $transaksi */
            $transaksi = $this->transaksi->create($this->transaksiService->payloadTransaksi($siswa, $tagihan, MetodeBayarEnum::TUNAI, (int) $request->user()?->id));
            $this->detail->insertBanyak($this->transaksiService->payloadDetail($transaksi->id, $tagihan));

            // TODO: Phase 2 Hook - Increment rekening_siswa saldo_tabungan here (porsi_tabungan transaksi tunai)

            DB::commit();
        } catch (TagihanTidakTersediaException) {
            DB::rollBack();

            return ResponseHelper::error(null, trans('alert.spp_months_unavailable'), Response::HTTP_CONFLICT);
        } catch (Throwable $th) {
            DB::rollBack();

            return $this->writeError($th);
        }

        return ResponseHelper::success(
            TransaksiBankMiniResource::make($transaksi->setRelation('tagihan', $tagihan)),
            trans('alert.spp_cash_paid', ['count' => count($ids), 'order' => $transaksi->order_id]),
            Response::HTTP_CREATED,
        );
    }

    /**
     * Laporan kas: settlement dipisah antara kas fisik (tunai) dan gateway, default bulan berjalan.
     *
     * @param  BankMiniFilterRequest  $request
     * @return View
     */
    public function laporanKas(BankMiniFilterRequest $request): View
    {
        $dari = Carbon::parse($request->validated('dari') ?? now('Asia/Jakarta')->startOfMonth()->toDateString(), 'Asia/Jakarta');
        $sampai = Carbon::parse($request->validated('sampai') ?? now('Asia/Jakarta')->toDateString(), 'Asia/Jakarta');
        $metode = $request->validated('metode');

        return view('bank-mini.admin.laporan-kas', [
            'dari' => $dari,
            'sampai' => $sampai,
            'metode' => $metode,
            'ringkasan' => $this->laporan->ringkasanKas($dari, $sampai),
            'transaksi' => $this->laporan->laporanKas($dari, $sampai, $metode),
            'tahun' => AcademicYearHelper::current(),
            'opsiTahun' => [AcademicYearHelper::current()],
        ]);
    }
}
