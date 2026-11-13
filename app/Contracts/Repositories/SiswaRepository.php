<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\SiswaRepositoryInterface;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class SiswaRepository extends BaseRepository implements SiswaRepositoryInterface
{
    /** @var class-string<Siswa> */
    protected string $model = Siswa::class;

    /**
     * Cari siswa berdasarkan NISN.
     *
     * @param  string  $nisn
     * @return ?Siswa
     */
    public function findByNisn(string $nisn): ?Siswa
    {
        return $this->query()->where('nisn', trim($nisn))->first();
    }

    /**
     * Ambil siswa aktif satu kelas, urut nama.
     *
     * @param  string  $kelas
     * @return Collection
     */
    public function aktifPerKelas(string $kelas): Collection
    {
        return $this->query()
            ->where('is_active', true)
            ->where('kelas', $kelas)
            ->orderBy('nama')
            ->get(['id', 'nisn', 'nama', 'kelas', 'jurusan']);
    }

    /**
     * Ambil id siswa aktif, seluruhnya atau satu kelas saja.
     *
     * @param  ?string  $kelas
     * @return array<int, int>
     */
    public function idsAktif(?string $kelas = null): array
    {
        return $this->query()
            ->where('is_active', true)
            ->when($kelas, fn (Builder $query, string $value) => $query->where('kelas', $value))
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    /**
     * Jumlah siswa aktif per kelas, sebagai [kelas => jumlah].
     *
     * @return array<string, int>
     */
    public function jumlahAktifPerKelas(): array
    {
        return $this->query()
            ->where('is_active', true)
            ->groupBy('kelas')
            ->selectRaw('kelas, COUNT(*) AS jumlah')
            ->toBase()
            ->pluck('jumlah', 'kelas')
            ->map(fn ($jumlah) => (int) $jumlah)
            ->all();
    }

    /**
     * Tambah atau perbarui siswa berdasarkan NISN tanpa menyentuh password yang sudah ada.
     * Baris wajib berisi nisn, nama, kelas, jurusan, password, is_active, created_at, updated_at.
     *
     * @param  array<int, array<string, mixed>>  $rows
     * @return int
     */
    public function upsertByNisn(array $rows): int
    {
        if ($rows === []) {
            return 0;
        }

        return $this->query()->upsert($rows, ['nisn'], ['nama', 'kelas', 'jurusan', 'is_active', 'updated_at']);
    }

    /**
     * Ambil siswa yang belum punya password (data impor lama).
     *
     * @param  int  $limit
     * @return Collection
     */
    public function tanpaPassword(int $limit = 500): Collection
    {
        return $this->query()->whereNull('password')->limit($limit)->get(['id', 'nisn']);
    }

    /**
     * Isi password awal hanya bila kolom password masih kosong, agar password
     * yang sudah diganti siswa tidak tertimpa.
     *
     * @param  int  $id
     * @param  string  $hash
     * @return int Jumlah baris terpengaruh
     */
    public function isiPasswordAwal(int $id, string $hash): int
    {
        return $this->query()
            ->whereKey($id)
            ->whereNull('password')
            ->update(['password' => $hash, 'updated_at' => now()]);
    }
}
