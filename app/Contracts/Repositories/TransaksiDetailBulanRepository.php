<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\TransaksiDetailBulanRepositoryInterface;
use App\Enums\BankMini\StatusTransaksiEnum;
use App\Models\TransaksiDetailBulan;
use Illuminate\Support\Collection;

class TransaksiDetailBulanRepository extends BaseRepository implements TransaksiDetailBulanRepositoryInterface
{
    /** @var class-string<TransaksiDetailBulan> */
    protected string $model = TransaksiDetailBulan::class;

    /**
     * Simpan rincian bulan satu transaksi. Baris wajib berisi timestamps.
     *
     * @param  array<int, array<string, mixed>>  $rows
     * @return bool
     */
    public function insertBanyak(array $rows): bool
    {
        return $this->query()->insert($rows);
    }

    /**
     * Id tagihan yang tercakup dalam satu transaksi.
     *
     * @param  int  $transaksiId
     * @return array<int, int>
     */
    public function tagihanIds(int $transaksiId): array
    {
        return $this->query()
            ->where('transaksi_id', $transaksiId)
            ->pluck('tagihan_spp_id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    /**
     * Data pelunasan per tagihan (order_id, metode, tanggal bayar) untuk Kartu SPP,
     * di-key dengan tagihan_spp_id. Join ke transaksi settlement, tanpa sub-query.
     *
     * @param  array<int, int>  $tagihanIds
     * @return Collection
     */
    public function pembayaranLunas(array $tagihanIds): Collection
    {
        return $this->query()
            ->join('transaksi_bank_mini', 'transaksi_bank_mini.id', '=', 'transaksi_detail_bulan.transaksi_id')
            ->whereIn('transaksi_detail_bulan.tagihan_spp_id', $tagihanIds)
            ->where('transaksi_bank_mini.status', StatusTransaksiEnum::SETTLEMENT->value)
            ->select([
                'transaksi_detail_bulan.tagihan_spp_id',
                'transaksi_bank_mini.order_id',
                'transaksi_bank_mini.metode',
                'transaksi_bank_mini.channel',
                'transaksi_bank_mini.paid_at',
            ])
            ->toBase()
            ->get()
            ->keyBy('tagihan_spp_id');
    }
}
