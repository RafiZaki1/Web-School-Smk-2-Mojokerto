<?php

namespace App\Services\BankMini;

use App\Contracts\Interfaces\MonitoringKelasServiceInterface;
use App\Enums\BankMini\StatusLunasFilterEnum;
use App\Enums\SchoolClassEnum;
use Illuminate\Support\Collection;

class MonitoringKelasService implements MonitoringKelasServiceInterface
{
    /**
     * Satu baris per kelas: jurusan, wali kelas, jumlah siswa, persentase lunas sampai bulan
     * berjalan, siswa yang belum lunas, tunggakan, tabungan, dan status kelas.
     * Status "kosong" = belum ada bulan yang jatuh tempo (atau tagihan belum dibuat).
     *
     * @param  array<int, string>  $daftarKelas
     * @param  Collection  $rekap
     * @param  array<string, int>  $siswa
     * @param  array<string, int>  $tabungan
     * @param  Collection  $wali
     * @return array<int, array<string, mixed>>
     */
    public function rekapKelas(array $daftarKelas, Collection $rekap, array $siswa, array $tabungan, Collection $wali): array
    {
        return collect($daftarKelas)->map(function (string $kelas) use ($rekap, $siswa, $tabungan, $wali) {
            $r = $rekap->get($kelas);
            $jatuhTempo = (int) ($r->jatuh_tempo ?? 0);
            $siswaBelum = (int) ($r->siswa_belum ?? 0);
            $jurusan = SchoolClassEnum::from($kelas)->major();

            return [
                'kelas' => $kelas,
                'jurusan' => $jurusan->value,
                'jurusan_label' => $jurusan->label(),
                'wali' => $wali->get($kelas)?->user?->name,
                'siswa' => $siswa[$kelas] ?? 0,
                'jatuh_tempo' => $jatuhTempo,
                'lunas' => (int) ($r->lunas ?? 0),
                'persen' => $jatuhTempo > 0 ? (int) floor(($r->lunas / $jatuhTempo) * 100) : null,
                'siswa_belum' => $siswaBelum,
                'tunggakan' => (int) ($r->tunggakan ?? 0),
                'tabungan' => $tabungan[$kelas] ?? 0,
                'status' => match (true) {
                    $jatuhTempo === 0 => 'kosong',
                    $siswaBelum === 0 => StatusLunasFilterEnum::LUNAS->value,
                    default => StatusLunasFilterEnum::BELUM->value,
                },
            ];
        })->all();
    }

    /**
     * Saring baris rekap per jurusan dan status kelas.
     *
     * @param  array<int, array<string, mixed>>  $baris
     * @param  ?string  $jurusan
     * @param  ?string  $status
     * @return array<int, array<string, mixed>>
     */
    public function saringRekap(array $baris, ?string $jurusan, ?string $status): array
    {
        return collect($baris)
            ->when($jurusan, fn (Collection $c) => $c->where('jurusan', $jurusan))
            ->when($status, fn (Collection $c) => $c->where('status', $status))
            ->values()
            ->all();
    }

    /**
     * Total untuk kartu ringkasan dari baris kelas yang sedang ditampilkan.
     *
     * @param  array<int, array<string, mixed>>  $baris
     * @return array<string, int>
     */
    public function ringkasan(array $baris): array
    {
        $c = collect($baris);

        return [
            'kelas' => $c->count(),
            'kelas_belum' => $c->where('status', StatusLunasFilterEnum::BELUM->value)->count(),
            'siswa' => (int) $c->sum('siswa'),
            'siswa_belum' => (int) $c->sum('siswa_belum'),
            'tunggakan' => (int) $c->sum('tunggakan'),
            'tabungan' => (int) $c->sum('tabungan'),
        ];
    }

    /**
     * Saring baris matriks satu kelas berdasarkan status lunas siswa sampai bulan berjalan.
     *
     * @param  array<int, array<string, mixed>>  $matriks
     * @param  ?string  $status
     * @return array<int, array<string, mixed>>
     */
    public function saringMatriks(array $matriks, ?string $status): array
    {
        if ($status === null) {
            return $matriks;
        }

        $lunas = $status === StatusLunasFilterEnum::LUNAS->value;

        return collect($matriks)->filter(fn (array $row) => $row['lunas_berjalan'] === $lunas)->values()->all();
    }
}
