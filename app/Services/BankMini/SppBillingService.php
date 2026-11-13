<?php

namespace App\Services\BankMini;

use App\Contracts\Interfaces\SppBillingServiceInterface;
use App\Enums\BankMini\BulanAkademikEnum;
use App\Enums\BankMini\StatusTagihanEnum;
use App\Helpers\AcademicYearHelper;
use App\Models\Siswa;
use App\Models\TagihanSpp;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class SppBillingService implements SppBillingServiceInterface
{
    /**
     * Bentuk baris tagihan 12 bulan (Juli-Juni) untuk setiap siswa. Nominal disalin dari
     * config supaya perubahan tarif tahun depan tidak mengubah tagihan lama.
     *
     * @param  array<int, int>  $siswaIds
     * @param  string  $tahunAjaran
     * @return array<int, array<string, mixed>>
     */
    public function susunTagihan(array $siswaIds, string $tahunAjaran): array
    {
        $now = now();
        $bulan = collect(BulanAkademikEnum::cases())->map(fn (BulanAkademikEnum $item) => [
            'tahun_ajaran' => $tahunAjaran,
            'bulan' => $item->value,
            'urutan' => $item->urutan(),
            'nama_bulan' => $item->nama(),
            'nominal_spp' => (int) config('bank_mini.nominal_spp'),
            'nominal_tabungan' => (int) config('bank_mini.nominal_tabungan'),
            'status' => StatusTagihanEnum::BELUM_LUNAS->value,
            'jatuh_tempo' => $this->jatuhTempo($item, $tahunAjaran),
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return collect($siswaIds)
            ->flatMap(fn (int $siswaId) => $bulan->map(fn (array $row) => ['siswa_id' => $siswaId, ...$row]))
            ->all();
    }

    /**
     * Jumlahkan porsi SPP dan tabungan dari daftar tagihan.
     *
     * @param  Collection  $tagihan
     * @return array{bulan: int, porsi_spp: int, porsi_tabungan: int, total: int}
     */
    public function hitungTotal(Collection $tagihan): array
    {
        $spp = (int) $tagihan->sum('nominal_spp');
        $tabungan = (int) $tagihan->sum('nominal_tabungan');

        return [
            'bulan' => $tagihan->count(),
            'porsi_spp' => $spp,
            'porsi_tabungan' => $tabungan,
            'total' => $spp + $tabungan,
        ];
    }

    /**
     * Angka untuk empat kartu dasbor siswa pada tahun ajaran terpilih.
     *
     * @param  Collection  $tagihan
     * @param  int  $tabungan
     * @param  int  $pending
     * @return array<string, int>
     */
    public function ringkasanSiswa(Collection $tagihan, int $tabungan, int $pending): array
    {
        $menunggak = $tagihan->filter(fn (TagihanSpp $item) => $item->statusTampil() === 'menunggak');

        return [
            'bulan_lunas' => $tagihan->filter(fn (TagihanSpp $item) => $item->status === StatusTagihanEnum::LUNAS)->count(),
            'bulan_total' => $tagihan->count(),
            'total_tabungan' => $tabungan,
            'bulan_menunggak' => $menunggak->count(),
            'total_tunggakan' => $this->hitungTotal($menunggak)['total'],
            'transaksi_pending' => $pending,
        ];
    }

    /**
     * Susun baris matriks kelas: satu siswa, 12 sel status bulan, dan total tabungan.
     *
     * @param  Collection  $siswa
     * @param  Collection  $tagihan
     * @param  array<int, int>  $tabungan
     * @return array<int, array<string, mixed>>
     */
    public function matriksKelas(Collection $siswa, Collection $tagihan, array $tabungan): array
    {
        $perSiswa = $tagihan->groupBy('siswa_id');

        return $siswa->map(function (Siswa $item) use ($perSiswa, $tabungan) {
            $bulan = $perSiswa->get($item->id, collect())->keyBy('urutan');

            return [
                'siswa' => $item,
                'bulan' => collect(range(1, 12))->mapWithKeys(fn (int $urutan) => [$urutan => $bulan->get($urutan)])->all(),
                'belum_dibayar' => $bulan->filter(fn (TagihanSpp $tagihan) => $tagihan->bisaDibayar())->values(),
                'menunggak' => $bulan->filter(fn (TagihanSpp $tagihan) => $tagihan->statusTampil() === 'menunggak')->count(),
                // Lunas sampai bulan berjalan: tidak ada bulan jatuh tempo yang belum lunas (pending ikut dihitung belum).
                'lunas_berjalan' => $bulan->isNotEmpty() && $bulan->every(fn (TagihanSpp $tagihan) => $tagihan->status === StatusTagihanEnum::LUNAS
                    || ! $tagihan->jatuh_tempo->lt(today('Asia/Jakarta')->toDateString())),
                'tabungan' => $tabungan[$item->id] ?? 0,
            ];
        })->values()->all();
    }

    /**
     * Gabungkan tahun ajaran yang punya tagihan dengan tahun berjalan dan tahun berikutnya.
     *
     * @param  array<int, string>  $tersedia
     * @return array<int, string>
     */
    public function pilihanTahun(array $tersedia): array
    {
        $berjalan = AcademicYearHelper::current();
        [, $akhir] = explode('/', $berjalan);

        return collect([...$tersedia, $berjalan, $akhir.'/'.((int) $akhir + 1)])
            ->unique()
            ->sortDesc()
            ->values()
            ->all();
    }

    /**
     * Tanggal jatuh tempo bulan tagihan pada tahun ajaran tertentu.
     *
     * @param  BulanAkademikEnum  $bulan
     * @param  string  $tahunAjaran
     * @return string
     */
    private function jatuhTempo(BulanAkademikEnum $bulan, string $tahunAjaran): string
    {
        return Carbon::create($bulan->tahunKalender($tahunAjaran), $bulan->value, 1)
            ->day(min((int) config('bank_mini.tanggal_jatuh_tempo'), 28))
            ->toDateString();
    }
}
