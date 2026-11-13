<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\BankMiniTransaksiServiceInterface;
use App\Contracts\Interfaces\SppBillingServiceInterface;
use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\TransaksiDetailBulanRepositoryInterface;
use App\Contracts\Interfaces\TripayServiceInterface;
use App\Enums\BankMini\MetodeBayarEnum;
use App\Enums\BankMini\StatusTransaksiEnum;
use App\Exceptions\BankMini\GatewayPembayaranException;
use App\Exceptions\BankMini\TagihanTidakTersediaException;
use App\Helpers\AcademicYearHelper;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\BankMiniFilterRequest;
use App\Http\Requests\CheckoutSppRequest;
use App\Http\Resources\TransaksiBankMiniResource;
use App\Models\Siswa;
use App\Models\TransaksiBankMini;
use App\Traits\BankMini\MenerapkanStatusGateway;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Dasbor keuangan siswa dan checkout SPP lewat Tripay.
 */
class PortalSppController extends Controller
{
    use MenerapkanStatusGateway;

    /**
     * Inisialisasi PortalSppController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  TagihanSppRepositoryInterface  $tagihan
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     * @param  TransaksiDetailBulanRepositoryInterface  $detail
     * @param  SppBillingServiceInterface  $billing
     * @param  BankMiniTransaksiServiceInterface  $transaksiService
     * @param  TripayServiceInterface  $tripay
     */
    public function __construct(
        protected TagihanSppRepositoryInterface $tagihan,
        protected TransaksiBankMiniRepositoryInterface $transaksi,
        protected TransaksiDetailBulanRepositoryInterface $detail,
        protected SppBillingServiceInterface $billing,
        protected BankMiniTransaksiServiceInterface $transaksiService,
        protected TripayServiceInterface $tripay,
    ) {}

    /**
     * Dasbor keuangan: empat kartu ringkasan, 12 bulan tagihan, dan transaksi gateway yang masih menunggu.
     *
     * @param  BankMiniFilterRequest  $request
     * @return View
     */
    public function dashboard(BankMiniFilterRequest $request): View
    {
        /** @var Siswa $siswa */
        $siswa = $request->user('siswa');
        $this->lepasKedaluwarsaDiam($siswa->id);

        $tahun = $request->validated('tahun') ?? AcademicYearHelper::current();
        $tagihan = $this->tagihan->milikSiswa($siswa->id, $tahun);
        $pending = $this->transaksi->pendingGatewaySiswa($siswa->id);

        return view('bank-mini.siswa.dashboard', [
            'siswa' => $siswa,
            'tahun' => $tahun,
            'opsiTahun' => $this->billing->pilihanTahun($this->tagihan->tahunAjaranSiswa($siswa->id)),
            'tagihan' => $tagihan,
            'pending' => $pending,
            'ringkasan' => $this->billing->ringkasanSiswa($tagihan, $this->transaksi->totalTabungan($siswa->id), $pending->count()),
            'channels' => $this->channelAtauKosong(),
            'gatewaySiap' => $this->tripay->siap(),
            'emailInvoice' => $this->transaksi->emailTerakhir($siswa->id),
        ]);
    }

    /**
     * Buat transaksi pending, kunci bulan pilihan, lalu minta kode bayar ke Tripay. Tiga tabel
     * berubah (tagihan_spp, transaksi_bank_mini, transaksi_detail_bulan), jadi dibungkus DB
     * transaction. Bila Tripay gagal, semuanya di-rollback sehingga bulan bisa dipilih lagi.
     *
     * @param  CheckoutSppRequest  $request
     * @return JsonResponse
     */
    public function checkoutGateway(CheckoutSppRequest $request): JsonResponse
    {
        if (! $this->tripay->siap()) {
            return ResponseHelper::error(null, trans('alert.spp_gateway_not_configured'), Response::HTTP_SERVICE_UNAVAILABLE);
        }

        /** @var Siswa $siswa */
        $siswa = $request->user('siswa');
        $ids = array_map('intval', $request->validated('tagihan_ids'));
        $tagihan = $this->tagihan->bisaDibayar($ids, $siswa->id);

        if ($tagihan->count() !== count($ids)) {
            return ResponseHelper::error(null, trans('alert.spp_months_unavailable'), Response::HTTP_CONFLICT);
        }

        DB::beginTransaction();
        try {
            if ($this->tagihan->tandaiPending($ids, $siswa->id) !== count($ids)) {
                throw new TagihanTidakTersediaException;
            }

            /** @var TransaksiBankMini $transaksi */
            $transaksi = $this->transaksi->create($this->transaksiService->payloadTransaksi($siswa, $tagihan, MetodeBayarEnum::GATEWAY, null, $request->validated('email')));
            $this->detail->insertBanyak($this->transaksiService->payloadDetail($transaksi->id, $tagihan));

            $data = $this->tripay->handleCreateTransaction($transaksi, $siswa, $tagihan, $request->validated('metode_pembayaran'));
            $this->transaksi->simpanGateway($transaksi->id, $this->transaksiService->atributTransaksi($data));

            DB::commit();
        } catch (TagihanTidakTersediaException) {
            DB::rollBack();

            return ResponseHelper::error(null, trans('alert.spp_months_unavailable'), Response::HTTP_CONFLICT);
        } catch (GatewayPembayaranException $e) {
            DB::rollBack();
            Log::error($e->getMessage(), ['siswa_id' => $siswa->id]);

            return ResponseHelper::error(null, trans('alert.spp_gateway_unavailable'), Response::HTTP_BAD_GATEWAY);
        } catch (Throwable $th) {
            DB::rollBack();

            return $this->writeError($th);
        }

        return ResponseHelper::success(
            TransaksiBankMiniResource::make($this->transaksi->detailOrFail($transaksi->order_id, $siswa->id)),
            trans('alert.spp_checkout_created'),
            Response::HTTP_CREATED,
        );
    }

    /**
     * Tarik status terbaru dari Tripay untuk transaksi milik siswa. Berguna saat callback
     * belum sampai (mis. server lokal) atau siswa baru selesai membayar.
     *
     * @param  Request  $request
     * @param  string  $orderId
     * @return JsonResponse
     */
    public function cekStatus(Request $request, string $orderId): JsonResponse
    {
        /** @var Siswa $siswa */
        $siswa = $request->user('siswa');
        $transaksi = $this->transaksi->detailOrFail($orderId, $siswa->id);

        if ($transaksi->status === StatusTransaksiEnum::PENDING && $transaksi->reference && $this->tripay->siap()) {
            try {
                $this->sinkronStatusDariTripay($transaksi);
            } catch (GatewayPembayaranException $e) {
                Log::warning($e->getMessage(), ['order_id' => $orderId]);
            } catch (Throwable $th) {
                return $this->writeError($th);
            }
        }

        $transaksi = $this->transaksi->detailOrFail($orderId, $siswa->id);

        return ResponseHelper::success(
            TransaksiBankMiniResource::make($transaksi),
            trans('alert.spp_status_synced', ['status' => $transaksi->status->label()]),
        );
    }

    /**
     * Daftar channel Tripay; kosong bila gateway belum dikonfigurasi atau sedang tidak bisa dihubungi.
     *
     * @return Collection
     */
    private function channelAtauKosong(): Collection
    {
        if (! $this->tripay->siap()) {
            return collect();
        }

        try {
            return $this->tripay->handlePaymentChannels();
        } catch (GatewayPembayaranException $e) {
            Log::warning($e->getMessage());

            return collect();
        }
    }
}
