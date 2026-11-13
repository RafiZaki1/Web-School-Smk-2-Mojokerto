<?php

namespace App\Contracts\Interfaces;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Akun staf (admin, Tata Usaha, wali kelas).
 */
interface UserRepositoryInterface
{
    /**
     * Kontrak method findByLogin.
     *
     * @param  string  $login
     * @return ?User
     */
    public function findByLogin(string $login): ?User;

    /**
     * Kontrak method usernameDipakai.
     *
     * @param  string  $username
     * @param  ?int  $kecualiId
     * @return bool
     */
    public function usernameDipakai(string $username, ?int $kecualiId = null): bool;

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

    /**
     * Kontrak method delete.
     *
     * @param  Model  $model
     * @return bool
     */
    public function delete(Model $model): bool;
}
