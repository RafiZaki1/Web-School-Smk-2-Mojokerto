<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\PembayaranMasukRepositoryInterface;
use App\Models\TransaksiBankMini;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Query halaman Pembayaran Masuk: semua transaksi (tunai dan gateway) lintas status.
 */
class PembayaranMasukRepository extends BaseRepository implements PembayaranMasukRepositoryInterface
{
    /** @var class-string<TransaksiBankMini> */
    protected string $model = TransaksiBankMini::class;

    /**
     * Transaksi terbaru, bisa disaring status dan dicari lewat nama siswa, NISN, kelas,
     * nomor transaksi, atau reference Tripay. Pencarian lewat join ke siswa, tanpa sub-query.
     *
     * @param  ?string  $status
     * @param  ?string  $cari
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function daftar(?string $status, ?string $cari, int $perPage = 20): LengthAwarePaginator
    {
        return $this->query()
            ->select('transaksi_bank_mini.*')
            ->join('siswa', 'siswa.id', '=', 'transaksi_bank_mini.siswa_id')
            ->with(['siswa:id,nisn,nama,kelas', 'petugas:id,name', 'verifikator:id,name', 'tagihan'])
            ->when($status, fn (Builder $query, string $value) => $query->where('transaksi_bank_mini.status', $value))
            ->when($cari, function (Builder $query, string $kata) {
                $pola = '%'.addcslashes($kata, '%_\\').'%';

                $query->where(function (Builder $grup) use ($pola) {
                    $grup->where('siswa.nama', 'like', $pola)
                        ->orWhere('siswa.nisn', 'like', $pola)
                        ->orWhere('siswa.kelas', 'like', $pola)
                        ->orWhere('transaksi_bank_mini.order_id', 'like', $pola)
                        ->orWhere('transaksi_bank_mini.reference', 'like', $pola);
                });
            })
            ->latest('transaksi_bank_mini.id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Jumlah transaksi per status untuk angka di tab saringan, sebagai [status => jumlah].
     *
     * @return array<string, int>
     */
    public function jumlahPerStatus(): array
    {
        return $this->query()
            ->groupBy('status')
            ->selectRaw('status, COUNT(*) AS jumlah')
            ->toBase()
            ->pluck('jumlah', 'status')
            ->map(fn ($jumlah) => (int) $jumlah)
            ->all();
    }
}
