<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\BankMiniTransaksiServiceInterface;
use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\TransaksiDetailBulanRepositoryInterface;
use App\Enums\BankMini\AksiVerifikasiEnum;
use App\Enums\RoleEnum;
use App\Events\BankMini\PembayaranSppLunas;
use App\Exceptions\BankMini\TagihanTidakTersediaException;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\VerifikasiPembayaranRequest;
use App\Http\Resources\TransaksiBankMiniResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Kendali manual atas transaksi SPP di panel Bank Mini. Pembayaran online lunas otomatis lewat
 * Tripay; halaman ini untuk kasus di luar itu. Petugas menyetujui manual transaksi yang uangnya
 * sudah diterima tetapi belum tercatat. Admin memegang kendali penuh: juga menyetujui transaksi
 * yang sudah dibatalkan, membatalkan transaksi yang belum dibayar, dan mencabut pelunasan.
 */
class AdminVerifikasiController extends Controller
{
    /**
     * Inisialisasi AdminVerifikasiController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  TransaksiBankMiniRepositoryInterface  $transaksi
     * @param  TransaksiDetailBulanRepositoryInterface  $detail
     * @param  TagihanSppRepositoryInterface  $tagihan
     * @param  BankMiniTransaksiServiceInterface  $transaksiService
     */
    public function __construct(
        protected TransaksiBankMiniRepositoryInterface $transaksi,
        protected TransaksiDetailBulanRepositoryInterface $detail,
        protected TagihanSppRepositoryInterface $tagihan,
        protected BankMiniTransaksiServiceInterface $transaksiService,
    ) {}

    /**
     * Setujui manual: transaksi menjadi settlement dan bulannya lunas.
     *
     * @param  VerifikasiPembayaranRequest  $request
     * @param  string  $orderId
     * @return JsonResponse
     */
    public function setujui(VerifikasiPembayaranRequest $request, string $orderId): JsonResponse
    {
        return $this->putuskan(AksiVerifikasiEnum::SETUJUI, $request, $orderId);
    }

    /**
     * Batalkan transaksi yang belum dibayar atau cabut pelunasan (khusus admin).
     *
     * @param  VerifikasiPembayaranRequest  $request
     * @param  string  $orderId
     * @return JsonResponse
     */
    public function batalkan(VerifikasiPembayaranRequest $request, string $orderId): JsonResponse
    {
        return $this->putuskan(AksiVerifikasiEnum::BATALKAN, $request, $orderId);
    }

    /**
     * Jalankan satu keputusan. Status transaksi diubah dengan satu UPDATE bersyarat pada status
     * yang baru saja dibaca, jadi dua petugas yang menekan tombol bersamaan tidak saling menimpa.
     * Dua tabel berubah (transaksi_bank_mini, tagihan_spp), jadi dibungkus DB transaction.
     *
     * @param  AksiVerifikasiEnum  $aksi
     * @param  VerifikasiPembayaranRequest  $request
     * @param  string  $orderId
     * @return JsonResponse
     */
    private function putuskan(AksiVerifikasiEnum $aksi, VerifikasiPembayaranRequest $request, string $orderId): JsonResponse
    {
        $boleh = $aksi->statusAsal($request->user()?->role === RoleEnum::ADMIN->value);

        if ($boleh === []) {
            return ResponseHelper::error(null, trans('alert.forbidden'), Response::HTTP_FORBIDDEN);
        }

        $transaksi = $this->transaksi->detailOrFail($orderId);
        $sebelum = $transaksi->status;

        if (! in_array($sebelum, $boleh, true)) {
            return ResponseHelper::error(null, trans('alert.spp_verification_conflict', ['status' => $sebelum->label()]), Response::HTTP_CONFLICT);
        }

        $atribut = $this->transaksiService->atributVerifikasi($transaksi, $aksi, (int) $request->user()?->id, $request->validated('catatan'));

        DB::beginTransaction();
        try {
            if ($this->transaksi->ubahStatus($orderId, [$sebelum], $aksi->tujuan(), $atribut) === 0) {
                DB::rollBack();

                return ResponseHelper::error(null, trans('alert.spp_verification_conflict', ['status' => $sebelum->label()]), Response::HTTP_CONFLICT);
            }

            $ids = $this->detail->tagihanIds($transaksi->id);
            $berubah = $this->tagihan->pindahStatus($ids, $aksi->tagihanAsal($sebelum), $aksi->tagihanTujuan());

            // Bulan yang sudah lunas lewat transaksi lain tidak boleh dilunasi dua kali.
            if ($aksi === AksiVerifikasiEnum::SETUJUI && $berubah !== count($ids)) {
                throw new TagihanTidakTersediaException;
            }

            // TODO: Phase 2 Hook - sesuaikan rekening_siswa saldo_tabungan di sini (tambah saat setujui, kurangi saat pelunasan dicabut)

            DB::commit();
        } catch (TagihanTidakTersediaException) {
            DB::rollBack();

            return ResponseHelper::error(null, trans('alert.spp_approval_months_taken'), Response::HTTP_CONFLICT);
        } catch (Throwable $th) {
            DB::rollBack();

            return $this->writeError($th);
        }

        // Setelah commit: email invoice lunas ke siswa (listener KirimInvoiceSpp).
        if ($aksi === AksiVerifikasiEnum::SETUJUI) {
            PembayaranSppLunas::dispatch($orderId);
        }

        return ResponseHelper::success(TransaksiBankMiniResource::make($this->transaksi->detailOrFail($orderId)), trans($aksi->pesan()));
    }
}
