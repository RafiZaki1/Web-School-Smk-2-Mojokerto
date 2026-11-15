<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Enums\BankMini\StatusTagihanEnum;
use App\Models\TagihanSpp;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;

class TagihanSppRepository extends BaseRepository implements TagihanSppRepositoryInterface
{
    /** @var class-string<TagihanSpp> */
    protected string $model = TagihanSpp::class;

    /**
     * Simpan banyak tagihan sekaligus. Bulan yang sudah ada dilewati berkat unique index
     * (siswa_id, tahun_ajaran, bulan), jadi aman dijalankan ulang.
     *
     * @param  array<int, array<string, mixed>>  $rows
     * @return int Jumlah tagihan baru
     */
    public function insertIgnore(array $rows): int
    {
        return collect($rows)
            ->chunk(500)
            ->sum(fn (SupportCollection $chunk) => $this->query()->insertOrIgnore($chunk->values()->all()));
    }

    /**
     * Ambil 12 bulan tagihan siswa pada satu tahun ajaran, urut Juli sampai Juni.
     *
     * @param  int  $siswaId
     * @param  string  $tahunAjaran
     * @return Collection
     */
    public function milikSiswa(int $siswaId, string $tahunAjaran): Collection
    {
        return $this->query()
            ->where('siswa_id', $siswaId)
            ->where('tahun_ajaran', $tahunAjaran)
            ->orderBy('urutan')
            ->get();
    }

    /**
     * Ambil tagihan banyak siswa sekaligus untuk matriks kelas.
     *
     * @param  array<int, int>  $siswaIds
     * @param  string  $tahunAjaran
     * @return Collection
     */
    public function milikBanyakSiswa(array $siswaIds, string $tahunAjaran): Collection
    {
        return $this->query()
            ->whereIn('siswa_id', $siswaIds)
            ->where('tahun_ajaran', $tahunAjaran)
            ->orderBy('urutan')
            ->get();
    }

    /**
     * Ambil tagihan milik siswa yang masih belum lunas dari daftar id pilihan.
     *
     * @param  array<int, int>  $ids
     * @param  int  $siswaId
     * @return Collection
     */
    public function bisaDibayar(array $ids, int $siswaId): Collection
    {
        return $this->query()
            ->whereIn('id', $ids)
            ->where('siswa_id', $siswaId)
            ->where('status', StatusTagihanEnum::BELUM_LUNAS->value)
            ->orderBy('tahun_ajaran')
            ->orderBy('urutan')
            ->get();
    }

    /**
     * Daftar tahun ajaran yang punya tagihan untuk siswa, terbaru dulu.
     *
     * @param  int  $siswaId
     * @return array<int, string>
     */
    public function tahunAjaranSiswa(int $siswaId): array
    {
        return $this->query()
            ->where('siswa_id', $siswaId)
            ->distinct()
            ->orderByDesc('tahun_ajaran')
            ->pluck('tahun_ajaran')
            ->all();
    }

    /**
     * Daftar tahun ajaran yang sudah punya tagihan, terbaru dulu.
     *
     * @return array<int, string>
     */
    public function tahunAjaranTersedia(): array
    {
        return $this->query()->distinct()->orderByDesc('tahun_ajaran')->pluck('tahun_ajaran')->all();
    }

    /**
     * Kunci bulan pilihan menjadi pending untuk checkout gateway. Hanya bulan yang
     * masih belum_lunas yang berubah; pemanggil wajib membandingkan hasilnya dengan
     * jumlah id supaya bulan yang sedang dibayar di tab lain tidak ikut tertagih dua kali.
     *
     * @param  array<int, int>  $ids
     * @param  int  $siswaId
     * @return int Jumlah baris terpengaruh
     */
    public function tandaiPending(array $ids, int $siswaId): int
    {
        return $this->query()
            ->whereIn('id', $ids)
            ->where('siswa_id', $siswaId)
            ->where('status', StatusTagihanEnum::BELUM_LUNAS->value)
            ->update(['status' => StatusTagihanEnum::PENDING->value, 'updated_at' => now()]);
    }

    /**
     * Lunasi bulan pilihan dari pembayaran tunai di loket.
     *
     * @param  array<int, int>  $ids
     * @param  int  $siswaId
     * @return int Jumlah baris terpengaruh
     */
    public function lunasiTunai(array $ids, int $siswaId): int
    {
        return $this->query()
            ->whereIn('id', $ids)
            ->where('siswa_id', $siswaId)
            ->where('status', StatusTagihanEnum::BELUM_LUNAS->value)
            ->update(['status' => StatusTagihanEnum::LUNAS->value, 'lunas_at' => now(), 'updated_at' => now()]);
    }

    /**
     * Pindahkan status bulan secara atomic, hanya untuk bulan yang statusnya termasuk $dari.
     * Dipakai callback Tripay (kunci ulang, lepas pending) dan keputusan petugas (lunasi, cabut lunas).
     * Pemanggil membandingkan hasilnya dengan jumlah id bila semua bulan wajib ikut berubah.
     *
     * @param  array<int, int>  $ids
     * @param  array<int, StatusTagihanEnum>  $dari
     * @param  StatusTagihanEnum  $ke
     * @return int Jumlah baris terpengaruh
     */
    public function pindahStatus(array $ids, array $dari, StatusTagihanEnum $ke): int
    {
        return $this->query()
            ->whereIn('id', $ids)
            ->whereIn('status', array_map(fn (StatusTagihanEnum $status) => $status->value, $dari))
            ->update([
                'status' => $ke->value,
                'lunas_at' => $ke === StatusTagihanEnum::LUNAS ? now() : null,
                'updated_at' => now(),
            ]);
    }

    /**
     * Rekap per kelas untuk bulan yang sudah jatuh tempo: jumlah tagihan, yang lunas, nominal
     * tunggakan, dan jumlah siswa yang masih punya bulan belum lunas (termasuk pending).
     * Satu query join + group by, tanpa sub-query.
     *
     * @param  string  $tahunAjaran
     * @return SupportCollection
     */
    public function rekapPerKelas(string $tahunAjaran): SupportCollection
    {
        return $this->query()
            ->join('siswa', 'siswa.id', '=', 'tagihan_spp.siswa_id')
            ->where('siswa.is_active', true)
            ->where('tagihan_spp.tahun_ajaran', $tahunAjaran)
            ->whereDate('tagihan_spp.jatuh_tempo', '<', today('Asia/Jakarta')->toDateString())
            ->groupBy('siswa.kelas')
            ->selectRaw('siswa.kelas AS kelas, COUNT(*) AS jatuh_tempo')
            ->selectRaw('SUM(CASE WHEN tagihan_spp.status = ? THEN 1 ELSE 0 END) AS lunas', [StatusTagihanEnum::LUNAS->value])
            ->selectRaw(
                'SUM(CASE WHEN tagihan_spp.status = ? THEN tagihan_spp.nominal_spp + tagihan_spp.nominal_tabungan ELSE 0 END) AS tunggakan',
                [StatusTagihanEnum::BELUM_LUNAS->value]
            )
            ->selectRaw('COUNT(DISTINCT CASE WHEN tagihan_spp.status <> ? THEN tagihan_spp.siswa_id END) AS siswa_belum', [StatusTagihanEnum::LUNAS->value])
            ->toBase()
            ->get()
            ->keyBy('kelas');
    }
}
