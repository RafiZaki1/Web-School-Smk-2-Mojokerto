<?php

namespace App\Traits\BankMini;

use App\Contracts\Interfaces\BankMiniTransaksiServiceInterface;
use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\TransaksiDetailBulanRepositoryInterface;
use App\Contracts\Interfaces\TripayServiceInterface;
use App\Enums\BankMini\StatusTransaksiEnum;
use App\Events\BankMini\PembayaranSppLunas;
use App\Models\TransaksiBankMini;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Terapkan status akhir transaksi Tripay ke transaksi_bank_mini dan tagihan_spp.
 * Dipakai callback Tripay, tombol cek status siswa, dan perintah pelepas transaksi kedaluwarsa.
 *
 * Idempotensi tanpa locking (RULE #15): status transaksi diubah dengan satu UPDATE bersyarat
 * pada status lama. Bila 0 baris berubah, callback ini sudah pernah diproses dan diabaikan.
 */
trait MenerapkanStatusGateway
{
    /** Diisi lewat constructor promotion kelas pemakai dengan nama dan tipe yang sama. */
    protected TransaksiBankMiniRepositoryInterface $transaksi;

    protected TransaksiDetailBulanRepositoryInterface $detail;

    protected TagihanSppRepositoryInterface $tagihan;

    protected TripayServiceInterface $tripay;

    protected BankMiniTransaksiServiceInterface $transaksiService;

    /**
     * Ubah status transaksi dan tagihannya dalam satu DB transaction (dua tabel berubah).
     * Settlement boleh datang dari pending, expired, atau failed karena uangnya sudah diterima;
     * status gagal/kedaluwarsa hanya berlaku dari pending.
     *
     * @param  TransaksiBankMini  $transaksi
     * @param  StatusTransaksiEnum  $status
     * @param  array<string, mixed>  $atribut
     * @return bool true bila ada perubahan, false bila sudah diproses sebelumnya
     *
     * @throws Throwable
     */
    protected function terapkanStatusGateway(TransaksiBankMini $transaksi, StatusTransaksiEnum $status, array $atribut = []): bool
    {
        if ($status === StatusTransaksiEnum::PENDING) {
            return false;
        }

        $settlement = $status === StatusTransaksiEnum::SETTLEMENT;
        $dari = $settlement
            ? [StatusTransaksiEnum::PENDING, StatusTransaksiEnum::EXPIRED, StatusTransaksiEnum::FAILED]
            : [StatusTransaksiEnum::PENDING];

        DB::beginTransaction();
        try {
            if ($this->transaksi->ubahStatus($transaksi->order_id, $dari, $status, $atribut) === 0) {
                DB::rollBack();

                return false;
            }

            $tagihanIds = $this->detail->tagihanIds($transaksi->id);

            if ($settlement) {
                $this->lunasiTagihanGateway($transaksi, $tagihanIds);
            } else {
                $this->tagihan->lepasPending($tagihanIds);
            }

            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            throw $th;
        }

        // Setelah commit: notifikasi petugas + email invoice (listener di app/Listeners/BankMini).
        if ($settlement) {
            PembayaranSppLunas::dispatch($transaksi->order_id);
        }

        return true;
    }

    /**
     * Lepas transaksi gateway pending yang kode bayarnya sudah kedaluwarsa, agar bulannya bisa dipilih lagi.
     *
     * @param  ?int  $siswaId
     * @return int Jumlah transaksi yang dilepas
     *
     * @throws Throwable
     */
    protected function lepasTransaksiKedaluwarsa(?int $siswaId = null): int
    {
        return $this->transaksi
            ->pendingKedaluwarsa($siswaId)
            ->filter(fn (TransaksiBankMini $transaksi) => $this->terapkanStatusGateway($transaksi, StatusTransaksiEnum::EXPIRED))
            ->count();
    }

    /**
     * Lepas transaksi kedaluwarsa milik siswa tanpa menggagalkan halaman bila terjadi galat.
     *
     * @param  ?int  $siswaId
     * @return void
     */
    protected function lepasKedaluwarsaDiam(?int $siswaId = null): void
    {
        try {
            $this->lepasTransaksiKedaluwarsa($siswaId);
        } catch (Throwable $th) {
            Log::error($th);
        }
    }

    /**
     * Ambil status dari transaction/detail Tripay lalu terapkan bila merchant_ref dan nominalnya cocok.
     * Dipakai saat callback belum sampai (mis. server lokal) atau siswa menekan "Cek status".
     *
     * @param  TransaksiBankMini  $transaksi
     * @return void
     *
     * @throws Throwable
     */
    protected function sinkronStatusDariTripay(TransaksiBankMini $transaksi): void
    {
        $data = $this->tripay->handleTransactionDetail((string) $transaksi->reference);

        if (($data['merchant_ref'] ?? null) !== $transaksi->order_id || ! $this->nominalGatewayCocok($transaksi, (int) ($data['amount'] ?? 0))) {
            Log::warning('Bank Mini: detail Tripay ditolak (merchant_ref/nominal).', ['order_id' => $transaksi->order_id]);

            return;
        }

        $status = StatusTransaksiEnum::fromTripay((string) ($data['status'] ?? 'UNPAID'));
        $this->terapkanStatusGateway($transaksi, $status, $this->transaksiService->atributStatus($data, $status === StatusTransaksiEnum::SETTLEMENT));
    }

    /**
     * Total dibayar di Tripay (amount / total_amount) harus sama dengan SPP + biaya admin channel.
     *
     * @param  TransaksiBankMini  $transaksi
     * @param  int  $dibayar
     * @return bool
     */
    protected function nominalGatewayCocok(TransaksiBankMini $transaksi, int $dibayar): bool
    {
        return $dibayar === $transaksi->totalBayar();
    }

    /**
     * Lunasi bulan dari transaksi settlement dan catat bila ada bulan yang ternyata sudah lunas lewat transaksi lain.
     *
     * @param  TransaksiBankMini  $transaksi
     * @param  array<int, int>  $tagihanIds
     * @return void
     */
    private function lunasiTagihanGateway(TransaksiBankMini $transaksi, array $tagihanIds): void
    {
        $dilunasi = $this->tagihan->lunasiDariGateway($tagihanIds);

        if ($dilunasi < count($tagihanIds)) {
            Log::warning('Bank Mini: sebagian bulan sudah lunas sebelum settlement gateway, periksa kemungkinan bayar ganda.', [
                'order_id' => $transaksi->order_id,
                'tagihan_ids' => $tagihanIds,
                'dilunasi' => $dilunasi,
            ]);
        }

        // TODO: Phase 2 Hook - Increment rekening_siswa saldo_tabungan here
        // Contoh: $this->rekening->tambahSaldo($transaksi->siswa_id, $transaksi->porsi_tabungan);
        // (atomic increment, tetap di dalam DB transaction yang sama)
    }
}
