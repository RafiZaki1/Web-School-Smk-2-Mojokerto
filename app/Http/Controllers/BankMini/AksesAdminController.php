<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\UserRepositoryInterface;
use App\Enums\BankMini\TujuanPanelEnum;
use App\Enums\RoleEnum;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\AksesBankMiniRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

/**
 * Jembatan Panel Admin utama (Next.js, token Sanctum) ke panel Bank Mini (Blade, sesi).
 * Admin adalah tingkat tertinggi, jadi bisa membuka panel Bank Mini tanpa login ulang:
 * API membuat tautan bertanda tangan yang berlaku singkat, lalu tautan itu membuka sesi.
 */
class AksesAdminController extends Controller
{
    /** Masa berlaku tautan masuk, dalam detik. */
    private const BERLAKU_DETIK = 60;

    /**
     * Inisialisasi AksesAdminController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  UserRepositoryInterface  $user
     */
    public function __construct(
        protected UserRepositoryInterface $user,
    ) {}

    /**
     * Buat tautan masuk berumur pendek untuk admin yang sedang login di Panel Admin.
     *
     * @param  AksesBankMiniRequest  $request
     * @return JsonResponse
     */
    public function buatTautan(AksesBankMiniRequest $request): JsonResponse
    {
        $url = URL::temporarySignedRoute('bank-mini.admin.sso', now()->addSeconds(self::BERLAKU_DETIK), [
            'user' => $request->user()?->id,
            'tujuan' => $request->validated('tujuan'),
        ]);

        return ResponseHelper::success(['url' => $url], trans('alert.fetch_success', ['resource' => 'Tautan Bank Mini']));
    }

    /**
     * Buka sesi panel Bank Mini dari tautan bertanda tangan, lalu arahkan ke halaman tujuan.
     * Tanda tangan dan masa berlaku dicek middleware signed; di sini dipastikan akunnya admin.
     *
     * @param  Request  $request
     * @param  int  $user
     * @return RedirectResponse
     */
    public function masuk(Request $request, int $user): RedirectResponse
    {
        /** @var User $akun */
        $akun = $this->user->findOrFail($user);
        abort_unless($akun->role === RoleEnum::ADMIN->value, Response::HTTP_FORBIDDEN);

        Auth::guard('web')->login($akun);
        $request->session()->regenerate();

        $tujuan = TujuanPanelEnum::tryFrom((string) $request->query('tujuan')) ?? TujuanPanelEnum::MONITORING;

        return redirect()->route($tujuan->namaRoute());
    }
}
