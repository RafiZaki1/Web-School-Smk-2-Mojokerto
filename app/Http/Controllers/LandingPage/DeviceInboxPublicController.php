<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\DeviceInboxServiceInterface;
use App\Helpers\DeviceTokenHelper;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\AlumniServiceTrackResource;
use App\Http\Resources\DeviceNotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

/**
 * Ikon lonceng di navbar landing page, berisi notifikasi milik perangkat itu sendiri.
 */
class DeviceInboxPublicController extends Controller
{
    /**
     * Inisialisasi DeviceInboxPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  DeviceInboxServiceInterface  $inbox
     */
    public function __construct(protected DeviceInboxServiceInterface $inbox) {}

    /**
     * Tampilkan notifikasi, status pengajuan, dan jumlah belum dibaca.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $inbox = $this->inbox->inbox(DeviceTokenHelper::require($request));

        return ResponseHelper::success([
            'unread' => $inbox['unread'],
            'notifications' => DeviceNotificationResource::collection($inbox['notifications']),
            'requests' => AlumniServiceTrackResource::collection($inbox['requests']),
        ], trans('alert.fetch_success', ['resource' => 'Notifikasi']));
    }

    /**
     * Tandai semua notifikasi perangkat sebagai dibaca.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function markRead(Request $request): JsonResponse
    {
        $deviceToken = DeviceTokenHelper::require($request);

        try {
            $this->inbox->markAllRead($deviceToken);

            return ResponseHelper::success(null, trans('alert.notifications_read'));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
