<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\BankMiniTransaksiServiceInterface;
use App\Contracts\Interfaces\PembayaranMasukRepositoryInterface;
use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\TransaksiDetailBulanRepositoryInterface;
use App\Contracts\Interfaces\TripayServiceInterface;
use App\Enums\BankMini\MetodeBayarEnum;
use App\Enums\BankMini\StatusTransaksiEnum;
use App\Enums\RoleEnum;
use App\Exceptions\BankMini\GatewayPembayaranException;
use App\Helpers\AcademicYearHelper;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\PembayaranMasukFilterRequest;
use App\Http\Resources\TransaksiBankMiniResource;
use App\Traits\BankMini\MenerapkanStatusGateway;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Halaman Pembayaran Masuk panel petugas: log transaksi lintas status dan tarik status
 * terbaru dari Tripay. Kendali manual (setujui, batalkan) ada di AdminVerifikasiController.
 */
class AdminPembayaranController extends Controller
{
    use MenerapkanStatusGateway;

    /** Status yang masih bisa berubah menjadi lunas menurut Tripay. */
    private const BISA_DISINKRON = [
        StatusTransaksiEnum::PENDING,
        StatusTransaksiEnum::EXPIRED,
        StatusTransaksiEnum::FAILED,
        StatusTransaksiEnum::CANCELED,
    ];

    /**
     * Inisialisasi AdminPembayaranController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  PembayaranMasukRepositoryInterface  $pembayaran
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     * @param  TransaksiDetailBulanRepositoryInterface  $detail
     * @param  TagihanSppRepositoryInterface  $tagihan
     * @param  TripayServiceInterface  $tripay
     * @param  BankMiniTransaksiServiceInterface  $transaksiService
     */
    public function __construct(
        protected PembayaranMasukRepositoryInterface $pembayaran,
        protected TransaksiBankMiniRepositoryInterface $transaksi,
        protected TransaksiDetailBulanRepositoryInterface $detail,
        protected TagihanSppRepositoryInterface $tagihan,
        protected TripayServiceInterface $tripay,
        protected BankMiniTransaksiServiceInterface $transaksiService,
    ) {}

    /**
     * Daftar semua transaksi (log pembayaran siswa), bisa disaring status dan dicari.
     *
     * @param  PembayaranMasukFilterRequest  $request
     * @return View
     */
    public function index(PembayaranMasukFilterRequest $request): View
    {
        $this->lepasKedaluwarsaDiam();

        $cari = $request->validated('q');
        $status = $request->validated('status');

        return view('bank-mini.admin.pembayaran', [
            'transaksi' => $this->pembayaran->daftar($status, $cari),
            'jumlah' => $this->pembayaran->jumlahPerStatus(),
            'status' => $status,
            'cari' => $cari,
            'admin' => $request->user()?->role === RoleEnum::ADMIN->value,
            'tahun' => AcademicYearHelper::current(),
            'opsiTahun' => [AcademicYearHelper::current()],
        ]);
    }

    /**
     * Tarik status terbaru dari Tripay untuk satu transaksi gateway. Dipakai petugas saat
     * siswa sudah membayar tetapi callback belum sampai; bila Tripay menyatakan lunas, bulannya langsung lunas.
     *
     * @param  string  $orderId
     * @return JsonResponse
     */
    public function cekStatus(string $orderId): JsonResponse
    {
        $transaksi = $this->transaksi->detailOrFail($orderId);
        $bisa = $transaksi->metode === MetodeBayarEnum::GATEWAY
            && $transaksi->reference !== null
            && in_array($transaksi->status, self::BISA_DISINKRON, true);

        if (! $bisa || ! $this->tripay->siap()) {
            return ResponseHelper::error(null, trans('alert.spp_status_not_syncable'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $this->sinkronStatusDariTripay($transaksi);
        } catch (GatewayPembayaranException $e) {
            Log::warning($e->getMessage(), ['order_id' => $orderId]);

            return ResponseHelper::error(null, trans('alert.spp_gateway_unavailable'), Response::HTTP_BAD_GATEWAY);
        } catch (Throwable $th) {
            return $this->writeError($th);
        }

        $transaksi = $this->transaksi->detailOrFail($orderId);

        return ResponseHelper::success(
            TransaksiBankMiniResource::make($transaksi),
            trans('alert.spp_status_synced', ['status' => $transaksi->status->label()]),
        );
    }
}
