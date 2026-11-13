<?php

namespace App\Contracts\Interfaces;

use App\Models\User;

interface AuthServiceInterface
{
    /**
     * Login admin dengan email atau username.
     *
     * @param  string  $login
     * @param  string  $password
     * @param  string  $device
     * @return array{user: User, token: string}
     */
    public function login(string $login, string $password, string $device = 'admin-panel'): array;

    /**
     * Kontrak method logout.
     *
     * @param  User  $user
     * @return void
     */
    public function logout(User $user): void;
}
