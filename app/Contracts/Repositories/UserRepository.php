<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /** @var class-string<User> */
    protected string $model = User::class;

    /**
     * Cari akun staf berdasarkan username atau email.
     *
     * @param  string  $login
     * @return ?User
     */
    public function findByLogin(string $login): ?User
    {
        $login = trim($login);

        return $this->query()
            ->where(fn (Builder $query) => $query->where('username', $login)->orWhere('email', $login))
            ->first();
    }

    /**
     * Username atau email sudah dipakai akun lain.
     *
     * @param  string  $username
     * @param  ?int  $kecualiId
     * @return bool
     */
    public function usernameDipakai(string $username, ?int $kecualiId = null): bool
    {
        return $this->query()
            ->where(fn (Builder $query) => $query->where('username', $username)->orWhere('email', $username))
            ->when($kecualiId, fn (Builder $query, int $id) => $query->whereKeyNot($id))
            ->exists();
    }
}
