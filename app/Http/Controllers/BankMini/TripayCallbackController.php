<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\BankMiniTransaksiServiceInterface;
use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\TransaksiDetailBulanRepositoryInterface;
use App\Contracts\Interfaces\TripayServiceInterface;
use App\Enums\BankMini\StatusTransaksiEnum;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\TripayCallbackRequest;
use App\Traits\BankMini\MenerapkanStatusGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * POST /api/bank-mini/webhook. Berada di routes/api.php sehingga tidak melewati CSRF.
 * Signature HMAC-SHA256 dicek middleware tripay.signature; idempotensi lewat UPDATE
 * bersyarat di trait MenerapkanStatusGateway.
 */
class TripayCallbackController extends Controller
{
    use MenerapkanStatusGateway;

    /**
     * Inisialisasi TripayCallbackController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     * @param  TransaksiDetailBulanRepositoryInterface  $detail
     * @param  TagihanSppRepositoryInterface  $tagihan
     * @param  TripayServiceInterface  $tripay
     * @param  BankMiniTransaksiServiceInterface  $transaksiService
     */
    public function __construct(
        protected TransaksiBankMiniRepositoryInterface $transaksi,
        protected TransaksiDetailBulanRepositoryInterface $detail,
        protected TagihanSppRepositoryInterface $tagihan,
        protected TripayServiceInterface $tripay,
        protected BankMiniTransaksiServiceInterface $transaksiService,
    ) {}

    /**
     * Terima callback payment_status Tripay dan terapkan status transaksi.
     *
     * @param  TripayCallbackRequest  $request
     * @return JsonResponse
     */
    public function handle(TripayCallbackRequest $request): JsonResponse
    {
        $transaksi = $this->transaksi->findGateway($request->validated('merchant_ref'), $request->validated('reference'));

        if (! $transaksi) {
            return ResponseHelper::error(null, trans('alert.not_found'), Response::HTTP_NOT_FOUND);
        }

        if (! $this->nominalGatewayCocok($transaksi, (int) $request->validated('total_amount'))) {
            Log::warning('Bank Mini callback: nominal tidak cocok.', [
                'order_id' => $transaksi->order_id,
                'total_amount' => $request->validated('total_amount'),
            ]);

            return ResponseHelper::error(null, trans('alert.webhook_amount_mismatch'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $status = StatusTransaksiEnum::fromTripay($request->validated('status'));
        $atribut = $this->transaksiService->atributStatus([
            'payment_name' => $request->validated('payment_method'),
            'paid_at' => $request->validated('paid_at'),
        ], $status === StatusTransaksiEnum::SETTLEMENT);

        try {
            $berubah = $this->terapkanStatusGateway($transaksi, $status, $atribut);
        } catch (Throwable $th) {
            return $this->writeError($th);
        }

        // Tripay menganggap callback berhasil bila body berisi success: true.
        return ResponseHelper::success(
            ['order_id' => $transaksi->order_id, 'status' => $status->value],
            trans($berubah ? 'alert.webhook_processed' : 'alert.webhook_already_processed'),
        );
    }
}
