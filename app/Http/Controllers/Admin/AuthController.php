<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\AuthServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class AuthController extends Controller
{
    /**
     * Inisialisasi AuthController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected AuthServiceInterface $authService
    ) {}

    /**
     * Login admin dan kembalikan token akses beserta data pengguna.
     * Galat validasi kredensial dilempar ulang agar dirender handler sebagai 422.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login($request->validated('login'), $request->validated('password'));

            return ResponseHelper::success([
                'token' => $result['token'],
                'user' => new UserResource($result['user']),
            ], trans('alert.login_success'));
        } catch (ValidationException $th) {
            throw $th;
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan profil admin yang sedang login.
     */
    public function me(Request $request): JsonResponse
    {
        return ResponseHelper::success(
            new UserResource($request->user()),
            trans('alert.fetch_success', ['resource' => 'Profil admin'])
        );
    }

    /**
     * Cabut token akses yang sedang dipakai.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $this->authService->logout($request->user());

            return ResponseHelper::success(null, trans('alert.logout_success'));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
