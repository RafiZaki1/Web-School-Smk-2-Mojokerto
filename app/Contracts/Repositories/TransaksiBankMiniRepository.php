<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Enums\BankMini\MetodeBayarEnum;
use App\Enums\BankMini\StatusTransaksiEnum;
use App\Models\TransaksiBankMini;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class TransaksiBankMiniRepository extends BaseRepository implements TransaksiBankMiniRepositoryInterface
{
    /** @var class-string<TransaksiBankMini> */
    protected string $model = TransaksiBankMini::class;

    /**
     * Cari transaksi gateway berdasarkan merchant_ref (order_id) dan reference Tripay.
     *
     * @param  string  $orderId
     * @param  string  $reference
     * @return ?TransaksiBankMini
     */
    public function findGateway(string $orderId, string $reference): ?TransaksiBankMini
    {
        return $this->query()
            ->where('order_id', $orderId)
            ->where('reference', $reference)
            ->where('metode', MetodeBayarEnum::GATEWAY->value)
            ->first();
    }

    /**
     * Cari transaksi berdasarkan order_id tanpa relasi.
     *
     * @param  string  $orderId
     * @return ?TransaksiBankMini
     */
    public function findByOrderId(string $orderId): ?TransaksiBankMini
    {
        return $this->query()->where('order_id', $orderId)->first();
    }

    /**
     * Ambil transaksi lengkap untuk kwitansi. Bila siswaId diisi, transaksi milik siswa lain dianggap tidak ada.
     *
     * @param  string  $orderId
     * @param  ?int  $siswaId
     * @return TransaksiBankMini
     */
    public function detailOrFail(string $orderId, ?int $siswaId = null): TransaksiBankMini
    {
        return $this->query()
            ->with(['siswa', 'petugas:id,name', 'tagihan'])
            ->where('order_id', $orderId)
            ->when($siswaId, fn (Builder $query, int $id) => $query->where('siswa_id', $id))
            ->firstOrFail();
    }

    /**
     * Simpan data transaksi dari Tripay (reference, kode bayar, biaya admin, masa berlaku).
     * Kolom gateway_payload wajib sudah berupa string JSON karena query builder tidak menjalankan cast.
     *
     * @param  int  $id
     * @param  array<string, mixed>  $data
     * @return int Jumlah baris terpengaruh
     */
    public function simpanGateway(int $id, array $data): int
    {
        return $this->query()->whereKey($id)->update([...$data, 'updated_at' => now()]);
    }

    /**
     * Ubah status secara atomic hanya bila status sekarang termasuk $dari. Hasil 0 berarti
     * transaksi sudah diproses request lain (notifikasi ganda) atau tidak ditemukan.
     *
     * @param  string  $orderId
     * @param  array<int, StatusTransaksiEnum>  $dari
     * @param  StatusTransaksiEnum  $ke
     * @param  array<string, mixed>  $atribut
     * @return int Jumlah baris terpengaruh
     */
    public function ubahStatus(string $orderId, array $dari, StatusTransaksiEnum $ke, array $atribut = []): int
    {
        return $this->query()
            ->where('order_id', $orderId)
            ->whereIn('status', array_map(fn (StatusTransaksiEnum $status) => $status->value, $dari))
            ->update([...$atribut, 'status' => $ke->value, 'updated_at' => now()]);
    }

    /**
     * Riwayat transaksi siswa, terbaru dulu, beserta bulan yang dibayar.
     *
     * @param  int  $siswaId
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function riwayatSiswa(int $siswaId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->query()
            ->with('tagihan')
            ->where('siswa_id', $siswaId)
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Transaksi gateway siswa yang masih menunggu pembayaran.
     *
     * @param  int  $siswaId
     * @return Collection
     */
    public function pendingGatewaySiswa(int $siswaId): Collection
    {
        return $this->query()
            ->with('tagihan')
            ->where('siswa_id', $siswaId)
            ->where('metode', MetodeBayarEnum::GATEWAY->value)
            ->where('status', StatusTransaksiEnum::PENDING->value)
            ->latest('id')
            ->get();
    }

    /**
     * Transaksi gateway pending yang kode bayarnya sudah melewati masa berlaku.
     *
     * @param  ?int  $siswaId
     * @param  int  $limit
     * @return Collection
     */
    public function pendingKedaluwarsa(?int $siswaId = null, int $limit = 100): Collection
    {
        return $this->query()
            ->where('metode', MetodeBayarEnum::GATEWAY->value)
            ->where('status', StatusTransaksiEnum::PENDING->value)
            ->where('expires_at', '<', now())
            ->when($siswaId, fn (Builder $query, int $id) => $query->where('siswa_id', $id))
            ->limit($limit)
            ->get(['id', 'order_id', 'siswa_id']);
    }

    /**
     * Total tabungan fase 1 = SUM(porsi_tabungan) transaksi settlement.
     * TODO: Phase 2 Hook - ganti dengan saldo_tabungan dari tabel rekening_siswa.
     *
     * @param  int  $siswaId
     * @return int
     */
    public function totalTabungan(int $siswaId): int
    {
        return (int) $this->query()
            ->where('siswa_id', $siswaId)
            ->where('status', StatusTransaksiEnum::SETTLEMENT->value)
            ->sum('porsi_tabungan');
    }

    /**
     * Total tabungan per siswa untuk kolom matriks kelas, sebagai [siswa_id => nominal].
     *
     * @param  array<int, int>  $siswaIds
     * @return array<int, int>
     */
    public function tabunganPerSiswa(array $siswaIds): array
    {
        return $this->query()
            ->whereIn('siswa_id', $siswaIds)
            ->where('status', StatusTransaksiEnum::SETTLEMENT->value)
            ->groupBy('siswa_id')
            ->selectRaw('siswa_id, SUM(porsi_tabungan) AS total')
            ->toBase()
            ->pluck('total', 'siswa_id')
            ->map(fn ($total) => (int) $total)
            ->all();
    }

    /**
     * Email invoice yang terakhir dipakai siswa, untuk mengisi otomatis form checkout berikutnya.
     *
     * @param  int  $siswaId
     * @return ?string
     */
    public function emailTerakhir(int $siswaId): ?string
    {
        return $this->query()
            ->where('siswa_id', $siswaId)
            ->whereNotNull('email_invoice')
            ->latest('id')
            ->value('email_invoice');
    }
}
