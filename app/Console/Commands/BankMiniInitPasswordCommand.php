<?php

namespace App\Console\Commands;

use App\Contracts\Interfaces\SiswaRepositoryInterface;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

/**
 * Isi password default (hash NISN) untuk siswa yang kolom password-nya masih kosong.
 * Aman dijalankan berulang: siswa yang sudah punya password tidak disentuh.
 */
class BankMiniInitPasswordCommand extends Command
{
    /** @var string */
    protected $signature = 'bank-mini:init-password';

    /** @var string */
    protected $description = 'Isi password default NISN untuk akun siswa Bank Mini yang belum punya password';

    /**
     * Hash NISN per siswa lalu simpan dengan UPDATE bersyarat (hanya bila password masih null).
     *
     * @param  SiswaRepositoryInterface  $siswa
     * @return int
     */
    public function handle(SiswaRepositoryInterface $siswa): int
    {
        $total = $siswa->count(['password' => null]);

        if ($total === 0) {
            $this->info('Semua siswa sudah punya password.');

            return self::SUCCESS;
        }

        $bar = $this->output->createProgressBar($total);
        $diisi = 0;

        do {
            $batch = $siswa->tanpaPassword(200);

            foreach ($batch as $item) {
                $diisi += $siswa->isiPasswordAwal((int) $item->id, Hash::make((string) $item->nisn));
                $bar->advance();
            }
        } while ($batch->isNotEmpty());

        $bar->finish();
        $this->newLine();
        $this->info("{$diisi} siswa mendapat password default (NISN).");

        return self::SUCCESS;
    }
}
