<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\LaporanKasRepositoryInterface;
use App\Enums\BankMini\MetodeBayarEnum;
use App\Enums\BankMini\StatusTransaksiEnum;
use App\Models\TransaksiBankMini;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

/**
 * Query laporan kas Bank Mini: settlement dipisah kas fisik (tunai) dan gateway.
 */
class LaporanKasRepository extends BaseRepository implements LaporanKasRepositoryInterface
{
    /** @var class-string<TransaksiBankMini> */
    protected string $model = TransaksiBankMini::class;

    /**
     * Ringkasan settlement per metode (kas fisik vs gateway) pada rentang tanggal bayar.
     *
     * @param  Carbon  $dari
     * @param  Carbon  $sampai
     * @return array<string, array{jumlah: int, total: int, spp: int, tabungan: int}>
     */
    public function ringkasanKas(Carbon $dari, Carbon $sampai): array
    {
        $baris = $this->settlementAntara($dari, $sampai)
            ->groupBy('metode')
            ->selectRaw('metode, COUNT(*) AS jumlah, SUM(total_nominal) AS total, SUM(porsi_spp) AS spp, SUM(porsi_tabungan) AS tabungan')
            ->toBase()
            ->get()
            ->keyBy('metode');

        return collect(MetodeBayarEnum::values())->mapWithKeys(fn (string $metode) => [$metode => [
            'jumlah' => (int) ($baris[$metode]->jumlah ?? 0),
            'total' => (int) ($baris[$metode]->total ?? 0),
            'spp' => (int) ($baris[$metode]->spp ?? 0),
            'tabungan' => (int) ($baris[$metode]->tabungan ?? 0),
        ]])->all();
    }

    /**
     * Daftar settlement pada rentang tanggal bayar, bisa disaring per metode.
     *
     * @param  Carbon  $dari
     * @param  Carbon  $sampai
     * @param  ?string  $metode
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function laporanKas(Carbon $dari, Carbon $sampai, ?string $metode, int $perPage = 25): LengthAwarePaginator
    {
        return $this->settlementAntara($dari, $sampai)
            ->with(['siswa:id,nisn,nama,kelas', 'petugas:id,name', 'tagihan'])
            ->when($metode, fn (Builder $query, string $value) => $query->where('metode', $value))
            ->latest('paid_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Tabungan terkumpul per kelas (SUM porsi_tabungan transaksi settlement), sebagai [kelas => nominal].
     * TODO: Phase 2 Hook - ganti dengan saldo rekening_siswa bila penarikan tabungan sudah ada.
     *
     * @return array<string, int>
     */
    public function tabunganPerKelas(): array
    {
        return $this->query()
            ->join('siswa', 'siswa.id', '=', 'transaksi_bank_mini.siswa_id')
            ->where('transaksi_bank_mini.status', StatusTransaksiEnum::SETTLEMENT->value)
            ->groupBy('siswa.kelas')
            ->selectRaw('siswa.kelas AS kelas, SUM(transaksi_bank_mini.porsi_tabungan) AS total')
            ->toBase()
            ->pluck('total', 'kelas')
            ->map(fn ($total) => (int) $total)
            ->all();
    }

    /**
     * Transaksi (semua status) milik siswa satu kelas untuk halaman wali kelas, terbaru dulu.
     * Filter kelas lewat join ke tabel siswa, tanpa sub-query.
     *
     * @param  string  $kelas
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function transaksiKelas(string $kelas, int $perPage = 25): LengthAwarePaginator
    {
        return $this->query()
            ->select('transaksi_bank_mini.*')
            ->join('siswa', 'siswa.id', '=', 'transaksi_bank_mini.siswa_id')
            ->where('siswa.kelas', $kelas)
            ->with(['siswa:id,nisn,nama,kelas', 'petugas:id,name', 'tagihan'])
            ->latest('transaksi_bank_mini.id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Query dasar transaksi settlement dengan paid_at di antara dua tanggal (inklusif).
     * Batas hari dihitung di zona tanggal yang dikirim (WIB), lalu dikonversi ke zona
     * penyimpanan aplikasi karena query builder tidak mengonversi zona waktu.
     *
     * @param  Carbon  $dari
     * @param  Carbon  $sampai
     * @return Builder
     */
    private function settlementAntara(Carbon $dari, Carbon $sampai): Builder
    {
        $zona = (string) config('app.timezone');

        return $this->query()
            ->where('status', StatusTransaksiEnum::SETTLEMENT->value)
            ->whereBetween('paid_at', [
                $dari->copy()->startOfDay()->setTimezone($zona),
                $sampai->copy()->endOfDay()->setTimezone($zona),
            ]);
    }
}
