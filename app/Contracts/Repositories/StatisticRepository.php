<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\StatisticRepositoryInterface;
use App\Models\SchoolProfile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class StatisticRepository implements StatisticRepositoryInterface
{
    /**
     * Hitung jumlah siswa, guru, jurusan, dan alumni dari tabel masing-masing.
     *
     * @return array<string, int>
     */
    public function getCounts(): array
    {
        return [
            'total_students' => $this->countTable('students'),
            'total_teachers' => $this->countTable('teachers'),
            'total_majors' => $this->countTable('majors'),
            'total_alumni' => $this->countTable('alumni'),
        ];
    }

    /**
     * Ambil tahun berdiri sekolah dari profil sekolah.
     */
    public function establishedYear(): ?int
    {
        return SchoolProfile::query()->value('established_year');
    }

    /**
     * Hitung baris sebuah tabel, atau 0 bila tabel belum ada.
     */
    private function countTable(string $table): int
    {
        return Schema::hasTable($table) ? DB::table($table)->count() : 0;
    }
}
