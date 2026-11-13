<?php

namespace App\Http\Middleware;

use App\Helpers\ResponseHelper;
use App\Services\BankMini\TripayService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Validasi callback Tripay (pola CheckSignatureMiddleware api-getskill): header
 * X-Callback-Signature harus sama dengan HMAC-SHA256 body mentah, dan event harus payment_status.
 * Perbandingan memakai hash_equals agar tahan timing attack.
 */
class TripayCallbackSignatureMiddleware
{
    /**
     * Tolak callback yang signature atau event-nya tidak valid.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $signature = (string) $request->header('X-Callback-Signature');

        if ($signature === '' || ! hash_equals(TripayService::handleGenerateCallbackSignature($request), $signature)) {
            ResponseHelper::error(null, trans('alert.invalid_callback_signature'), Response::HTTP_FORBIDDEN);
        }

        if ($request->header('X-Callback-Event') !== 'payment_status') {
            ResponseHelper::error(null, trans('alert.invalid_callback_event'), Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
