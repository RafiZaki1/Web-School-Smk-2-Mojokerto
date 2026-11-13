<?php

namespace App\Console\Commands;

use App\Contracts\Interfaces\GraduateRepositoryInterface;
use App\Contracts\Interfaces\GraduationServiceInterface;
use App\Contracts\Interfaces\SiswaRepositoryInterface;
use App\Enums\SchoolClassEnum;
use Illuminate\Console\Command;
use Throwable;

/**
 * Salin siswa kelas XII angkatan aktif dari data kelulusan TU (tabel graduates) ke akun Bank Mini.
 * Siswa yang sudah ada diperbarui nama dan kelasnya; password yang sudah diganti tidak disentuh.
 */
class BankMiniSinkronSiswaCommand extends Command
{
    /** @var string */
    protected $signature = 'bank-mini:sync-siswa {--tahun= : Tahun lulus, default angkatan aktif pengaturan kelulusan}';

    /** @var string */
    protected $description = 'Sinkronkan akun siswa Bank Mini dari data kelulusan TU lalu isi password default NISN';

    /**
     * Jalankan sinkronisasi.
     *
     * @param  GraduateRepositoryInterface  $graduates
     * @param  GraduationServiceInterface  $graduation
     * @param  SiswaRepositoryInterface  $siswa
     * @return int
     */
    public function handle(GraduateRepositoryInterface $graduates, GraduationServiceInterface $graduation, SiswaRepositoryInterface $siswa): int
    {
        $tahun = (int) ($this->option('tahun') ?: $graduation->settings()->active_year);
        $now = now();

        $rows = $graduates->rosterActiveYear($tahun)
            ->filter(fn ($row) => SchoolClassEnum::fromInput($row->class_name) !== null)
            ->map(fn ($row) => [
                'nisn' => (string) $row->nisn,
                'nama' => (string) $row->full_name,
                'kelas' => SchoolClassEnum::fromInput($row->class_name)?->value,
                'jurusan' => SchoolClassEnum::fromInput($row->class_name)?->major()->value,
                'password' => null,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ])
            ->values();

        if ($rows->isEmpty()) {
            $this->warn("Tidak ada data kelulusan aktif untuk tahun lulus {$tahun}.");

            return self::SUCCESS;
        }

        try {
            $rows->chunk(500)->each(fn ($chunk) => $siswa->upsertByNisn($chunk->values()->all()));
        } catch (Throwable $th) {
            $this->error('Sinkronisasi gagal: '.$th->getMessage());

            return self::FAILURE;
        }

        $this->info("{$rows->count()} siswa angkatan lulus {$tahun} disinkronkan.");

        return $this->call('bank-mini:init-password');
    }
}
