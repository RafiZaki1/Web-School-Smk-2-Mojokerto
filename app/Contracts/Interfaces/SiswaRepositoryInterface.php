<?php

namespace App\Contracts\Interfaces;

use App\Models\Siswa;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Akun siswa portal Bank Mini.
 */
interface SiswaRepositoryInterface
{
    /**
     * Kontrak method findOrFail.
     *
     * @param  int|string  $id
     * @return Model
     */
    public function findOrFail(int|string $id): Model;

    /**
     * Kontrak method findByNisn.
     *
     * @param  string  $nisn
     * @return ?Siswa
     */
    public function findByNisn(string $nisn): ?Siswa;

    /**
     * Kontrak method update.
     *
     * @param  Model  $model
     * @param  array<string, mixed>  $data
     * @return Model
     */
    public function update(Model $model, array $data): Model;

    /**
     * Kontrak method aktifPerKelas.
     *
     * @param  string  $kelas
     * @return Collection
     */
    public function aktifPerKelas(string $kelas): Collection;

    /**
     * Kontrak method idsAktif.
     *
     * @param  ?string  $kelas
     * @return array<int, int>
     */
    public function idsAktif(?string $kelas = null): array;

    /**
     * Kontrak method jumlahAktifPerKelas.
     *
     * @return array<string, int>
     */
    public function jumlahAktifPerKelas(): array;

    /**
     * Kontrak method upsertByNisn.
     *
     * @param  array<int, array<string, mixed>>  $rows
     * @return int
     */
    public function upsertByNisn(array $rows): int;

    /**
     * Kontrak method tanpaPassword.
     *
     * @param  int  $limit
     * @return Collection
     */
    public function tanpaPassword(int $limit = 500): Collection;

    /**
     * Kontrak method isiPasswordAwal.
     *
     * @param  int  $id
     * @param  string  $hash
     * @return int
     */
    public function isiPasswordAwal(int $id, string $hash): int;

    /**
     * Kontrak method count.
     *
     * @param  array<string, mixed>  $where
     * @return int
     */
    public function count(array $where = []): int;
}
