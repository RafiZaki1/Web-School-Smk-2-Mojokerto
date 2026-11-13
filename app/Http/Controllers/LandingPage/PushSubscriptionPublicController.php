<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\WebPushServiceInterface;
use App\Helpers\DeviceTokenHelper;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\PushSubscriptionRequest;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Pendaftaran browser perangkat untuk menerima Web Push (notifikasi di bar layar HP).
 */
class PushSubscriptionPublicController extends Controller
{
    /**
     * Inisialisasi PushSubscriptionPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  WebPushServiceInterface  $webPush
     */
    public function __construct(protected WebPushServiceInterface $webPush) {}

    /**
     * Kunci publik VAPID. Bernilai null bila Web Push belum diatur di server.
     *
     * @return JsonResponse
     */
    public function key(): JsonResponse
    {
        return ResponseHelper::success(['public_key' => $this->webPush->publicKey()], trans('alert.fetch_success', ['resource' => 'Kunci notifikasi']));
    }

    /**
     * Simpan langganan push dari browser perangkat ini.
     *
     * @param  PushSubscriptionRequest  $request
     * @return JsonResponse
     */
    public function store(PushSubscriptionRequest $request): JsonResponse
    {
        $deviceToken = DeviceTokenHelper::require($request);

        if (! $this->webPush->isConfigured()) {
            return ResponseHelper::error(null, trans('alert.push_unavailable'), Response::HTTP_SERVICE_UNAVAILABLE);
        }

        try {
            $this->webPush->subscribe($deviceToken, $request->validated(), $request->userAgent());

            return ResponseHelper::success(null, trans('alert.push_subscribed'), Response::HTTP_CREATED);
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus langganan push browser ini.
     *
     * @param  PushSubscriptionRequest  $request
     * @return JsonResponse
     */
    public function destroy(PushSubscriptionRequest $request): JsonResponse
    {
        $deviceToken = DeviceTokenHelper::require($request);

        try {
            $this->webPush->unsubscribe($deviceToken, (string) $request->validated('endpoint'));

            return ResponseHelper::success(null, trans('alert.push_unsubscribed'));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
