<?php

namespace App\Services\Auth;

use App\Contracts\Interfaces\AuthServiceInterface;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService implements AuthServiceInterface
{
    /**
     * Verifikasi username atau email beserta password, lalu terbitkan token akses.
     *
     * @return array{user: User, token: string}
     *
     * @throws ValidationException
     */
    public function login(string $login, string $password, string $device = 'admin-panel'): array
    {
        $login = trim($login);

        $user = User::query()
            ->where('email', $login)
            ->orWhere('username', $login)
            ->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'login' => trans('alert.invalid_credentials'),
            ]);
        }

        return [
            'user' => $user,
            'token' => $user->createToken($device)->plainTextToken,
        ];
    }

    /**
     * Cabut token akses yang sedang dipakai pengguna.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }
}
