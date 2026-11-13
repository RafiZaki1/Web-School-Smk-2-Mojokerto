<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\SiswaRepositoryInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\SiswaLoginRequest;
use App\Http\Requests\SiswaPasswordRequest;
use App\Models\Siswa;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Login siswa portal Bank Mini memakai guard session "siswa". Username = NISN,
 * password awal = NISN.
 */
class SiswaAuthController extends Controller
{
    /**
     * Inisialisasi SiswaAuthController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SiswaRepositoryInterface  $siswa
     */
    public function __construct(
        protected SiswaRepositoryInterface $siswa,
    ) {}

    /**
     * Tampilkan halaman login siswa.
     *
     * @return View
     */
    public function showLogin(): View
    {
        return view('bank-mini.auth.login-siswa');
    }

    /**
     * Verifikasi username (NISN) + password lalu buka sesi guard siswa.
     *
     * @param  SiswaLoginRequest  $request
     * @return JsonResponse
     */
    public function login(SiswaLoginRequest $request): JsonResponse
    {
        $siswa = $this->siswa->findByNisn($request->validated('username'));

        if (! $siswa || ! $this->passwordCocok($siswa, $request->validated('password'))) {
            return ResponseHelper::error(['username' => [trans('alert.siswa_login_failed')]], trans('alert.siswa_login_failed'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (! $siswa->is_active) {
            return ResponseHelper::error(['username' => [trans('alert.siswa_inactive')]], trans('alert.siswa_inactive'), Response::HTTP_FORBIDDEN);
        }

        Auth::guard('siswa')->login($siswa, $request->boolean('remember'));
        $request->session()->regenerate();

        return ResponseHelper::success(['redirect' => route('bank-mini.dashboard')], trans('alert.login_success'));
    }

    /**
     * Ganti password siswa yang sedang login.
     *
     * @param  SiswaPasswordRequest  $request
     * @return JsonResponse
     */
    public function updatePassword(SiswaPasswordRequest $request): JsonResponse
    {
        /** @var Siswa $siswa */
        $siswa = $request->user('siswa');

        if (! $this->passwordCocok($siswa, $request->validated('password_lama'))) {
            return ResponseHelper::error(['password_lama' => [trans('alert.password_current_wrong')]], trans('alert.password_current_wrong'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $this->siswa->update($siswa, [
                'password' => $request->validated('password_baru'),
                'password_changed_at' => now(),
            ]);

            return ResponseHelper::success(null, trans('alert.password_changed'));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Akhiri sesi siswa.
     *
     * @param  Request  $request
     * @return RedirectResponse
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('siswa')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('bank-mini.login');
    }

    /**
     * Cocokkan password. Siswa impor lama yang password-nya masih null boleh masuk dengan
     * NISN, lalu hash NISN langsung disimpan agar login berikutnya lewat Hash::check biasa.
     *
     * @param  Siswa  $siswa
     * @param  string  $password
     * @return bool
     */
    private function passwordCocok(Siswa $siswa, string $password): bool
    {
        if ($siswa->password !== null) {
            return Hash::check($password, $siswa->password);
        }

        if (! hash_equals((string) $siswa->nisn, $password)) {
            return false;
        }

        $this->siswa->isiPasswordAwal($siswa->id, Hash::make($password));

        return true;
    }
}
