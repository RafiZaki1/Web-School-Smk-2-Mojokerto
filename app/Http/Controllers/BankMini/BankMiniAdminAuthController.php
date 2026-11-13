<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\UserRepositoryInterface;
use App\Contracts\Interfaces\WaliKelasRepositoryInterface;
use App\Enums\RoleEnum;
use App\Helpers\BankMiniBeranda;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\StafPasswordRequest;
use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Login sesi (guard web) untuk staf Bank Mini: petugas (petugas_bank_mini, admin) dan wali kelas.
 * Akun petugas terpisah dari Tata Usaha; akun wali kelas dibuat petugas di menu Akun Wali Kelas.
 */
class BankMiniAdminAuthController extends Controller
{
    private const ROLE_STAF = [RoleEnum::ADMIN->value, RoleEnum::PETUGAS_BANK_MINI->value, RoleEnum::WALI_KELAS->value];

    /**
     * Inisialisasi BankMiniAdminAuthController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  UserRepositoryInterface  $user
     * @param  WaliKelasRepositoryInterface  $waliKelas
     */
    public function __construct(
        protected UserRepositoryInterface $user,
        protected WaliKelasRepositoryInterface $waliKelas,
    ) {}

    /**
     * Tampilkan halaman login petugas.
     *
     * @return View
     */
    public function showLogin(): View
    {
        return view('bank-mini.auth.login-admin');
    }

    /**
     * Tampilkan halaman login wali kelas.
     *
     * @return View
     */
    public function showLoginWaliKelas(): View
    {
        return view('bank-mini.auth.login-walas');
    }

    /**
     * Verifikasi akun staf, buka sesi guard web, lalu arahkan ke beranda sesuai role.
     *
     * @param  LoginRequest  $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = $this->user->findByLogin($request->validated('login'));

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            return ResponseHelper::error(['login' => [trans('alert.invalid_credentials')]], trans('alert.invalid_credentials'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (! in_array($user->role, self::ROLE_STAF, true)) {
            return ResponseHelper::error(null, trans('alert.staff_only'), Response::HTTP_FORBIDDEN);
        }

        if ($user->role === RoleEnum::WALI_KELAS->value && ! $this->waliKelas->findByUser($user->id)) {
            return ResponseHelper::error(null, trans('alert.walas_not_assigned'), Response::HTTP_FORBIDDEN);
        }

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return ResponseHelper::success(['redirect' => BankMiniBeranda::staf($user)], trans('alert.login_success'));
    }

    /**
     * Ganti password akun wali kelas yang sedang login.
     *
     * @param  StafPasswordRequest  $request
     * @return JsonResponse
     */
    public function updatePassword(StafPasswordRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! Hash::check($request->validated('password_lama'), $user->password)) {
            return ResponseHelper::error(['password_lama' => [trans('alert.password_current_wrong')]], trans('alert.password_current_wrong'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $this->user->update($user, ['password' => $request->validated('password_baru')]);

            return ResponseHelper::success(null, trans('alert.password_changed'));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Akhiri sesi staf lalu kembali ke halaman login yang sesuai role.
     *
     * @param  Request  $request
     * @return RedirectResponse
     */
    public function logout(Request $request): RedirectResponse
    {
        $tujuan = BankMiniBeranda::loginStaf($request->user());

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->to($tujuan);
    }
}
