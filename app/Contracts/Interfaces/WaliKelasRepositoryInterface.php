<?php

namespace App\Contracts\Interfaces;

use App\Models\WaliKelas;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Penautan akun wali kelas ke kelas.
 */
interface WaliKelasRepositoryInterface
{
    /**
     * Kontrak method semuaPerKelas.
     *
     * @return Collection
     */
    public function semuaPerKelas(): Collection;

    /**
     * Kontrak method findByKelas.
     *
     * @param  string  $kelas
     * @return ?WaliKelas
     */
    public function findByKelas(string $kelas): ?WaliKelas;

    /**
     * Kontrak method findByUser.
     *
     * @param  int  $userId
     * @return ?WaliKelas
     */
    public function findByUser(int $userId): ?WaliKelas;

    /**
     * Kontrak method create.
     *
     * @param  array<string, mixed>  $data
     * @return Model
     */
    public function create(array $data): Model;

    /**
     * Kontrak method update.
     *
     * @param  Model  $model
     * @param  array<string, mixed>  $data
     * @return Model
     */
    public function update(Model $model, array $data): Model;
}
