<?php

namespace App\Contracts\Interfaces;

use App\Models\User;

interface AuthServiceInterface
{
    /**
     * Login admin dengan email atau username.
     *
     * @return array{user: User, token: string}
     */
    public function login(string $login, string $password, string $device = 'admin-panel'): array;

    public function logout(User $user): void;
}
