<?php

namespace App\Http\Middleware;

use App\Helpers\ResponseHelper;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleMiddleware
{
    /**
     * Pastikan pengguna yang sedang login memiliki salah satu role yang diizinkan.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! in_array($request->user()?->role, $roles, true)) {
            return ResponseHelper::error(null, trans('alert.forbidden'), Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
