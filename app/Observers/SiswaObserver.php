<?php

namespace App\Observers;

use App\Enums\SchoolClassEnum;
use App\Models\Siswa;
use Illuminate\Support\Facades\Hash;

class SiswaObserver
{
    /**
     * Isi password default berupa hash NISN dan jurusan dari nama kelas saat siswa dibuat.
     *
     * @param  Siswa  $siswa
     * @return void
     */
    public function creating(Siswa $siswa): void
    {
        if (blank($siswa->getAttributes()['password'] ?? null)) {
            $siswa->password = Hash::make((string) $siswa->nisn);
        }

        $siswa->jurusan ??= SchoolClassEnum::fromInput($siswa->kelas)?->major()->value;
    }

    /**
     * Sesuaikan jurusan bila kelas siswa berubah.
     *
     * @param  Siswa  $siswa
     * @return void
     */
    public function updating(Siswa $siswa): void
    {
        if ($siswa->isDirty('kelas')) {
            $siswa->jurusan = SchoolClassEnum::fromInput($siswa->kelas)?->major()->value;
        }
    }
}
