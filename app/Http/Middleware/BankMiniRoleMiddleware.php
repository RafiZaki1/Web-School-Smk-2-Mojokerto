<?php

namespace App\Http\Middleware;

use App\Enums\RoleEnum;
use App\Helpers\ResponseHelper;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Cek role staf di halaman Blade Bank Mini. Berbeda dengan CheckRoleMiddleware (API) yang
 * membalas JSON 403, halaman browser diarahkan ke tempat yang benar:
 * - wali kelas di area petugas → dasbor wali kelas, petugas di area wali kelas → monitoring;
 * - akun tanpa akses Bank Mini (mis. sesi lama akun Tata Usaha) → logout dari sesi Bank Mini
 *   lalu kembali ke halaman login dengan pesan, supaya tidak terjebak di halaman 403.
 */
class BankMiniRoleMiddleware
{
    private const ROLE_PETUGAS = [RoleEnum::ADMIN->value, RoleEnum::PETUGAS_BANK_MINI->value];

    /**
     * Teruskan request bila role diizinkan; selain itu alihkan sesuai role.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @param  string  ...$roles
     * @return Response
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $role = $request->user()?->role;

        if (in_array($role, $roles, true)) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return ResponseHelper::error(null, trans('alert.forbidden'), Response::HTTP_FORBIDDEN);
        }

        if ($role === RoleEnum::WALI_KELAS->value) {
            return redirect()->route('bank-mini.walas.dashboard');
        }

        if (in_array($role, self::ROLE_PETUGAS, true)) {
            return redirect()->route('bank-mini.admin.monitoring');
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $login = $request->is('bank-mini/wali-kelas*') ? 'bank-mini.walas.login' : 'bank-mini.admin.login';

        return redirect()->route($login)->with('pesan_login', trans('alert.staff_session_reset'));
    }
}
