<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\NotifikasiBankMiniRepositoryInterface;
use App\Models\NotifikasiBankMini;
use Illuminate\Database\Eloquent\Collection;

class NotifikasiBankMiniRepository extends BaseRepository implements NotifikasiBankMiniRepositoryInterface
{
    /** @var class-string<NotifikasiBankMini> */
    protected string $model = NotifikasiBankMini::class;

    /**
     * Simpan notifikasi untuk satu transaksi. insertOrIgnore + unique transaksi_id membuat
     * pemanggilan ganda (callback dan cek status bersamaan) tetap menghasilkan satu baris.
     *
     * @param  int  $transaksiId
     * @param  string  $judul
     * @param  string  $pesan
     * @return int Jumlah baris baru (0 bila sudah ada)
     */
    public function catat(int $transaksiId, string $judul, string $pesan): int
    {
        $now = now();

        return $this->query()->insertOrIgnore([
            'transaksi_id' => $transaksiId,
            'judul' => mb_substr($judul, 0, 150),
            'pesan' => mb_substr($pesan, 0, 255),
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    /**
     * Notifikasi terbaru beserta order_id transaksinya untuk tautan kwitansi.
     *
     * @param  int  $limit
     * @return Collection
     */
    public function terbaru(int $limit = 15): Collection
    {
        return $this->query()
            ->with('transaksi:id,order_id')
            ->latest('id')
            ->limit($limit)
            ->get();
    }

    /**
     * Jumlah notifikasi yang belum dibuka petugas.
     *
     * @return int
     */
    public function jumlahBelumDibaca(): int
    {
        return $this->query()->whereNull('dibaca_at')->count();
    }

    /**
     * Tandai semua notifikasi yang belum dibaca sebagai sudah dibaca.
     *
     * @return int Jumlah baris terpengaruh
     */
    public function tandaiSemuaDibaca(): int
    {
        return $this->query()->whereNull('dibaca_at')->update(['dibaca_at' => now(), 'updated_at' => now()]);
    }
}
