<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\AlumniServiceRequestRepositoryInterface;
use App\Contracts\Interfaces\DeviceInboxServiceInterface;
use App\Contracts\Interfaces\DeviceNotificationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class DeviceInboxService implements DeviceInboxServiceInterface
{
    /**
     * Inisialisasi DeviceInboxService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  DeviceNotificationRepositoryInterface  $notifications
     * @param  AlumniServiceRequestRepositoryInterface  $requests
     */
    public function __construct(
        protected DeviceNotificationRepositoryInterface $notifications,
        protected AlumniServiceRequestRepositoryInterface $requests,
    ) {}

    /**
     * Ambil notifikasi terbaru, pengajuan, dan jumlah belum dibaca milik perangkat.
     *
     * @param  string  $deviceToken
     * @return array{notifications: Collection, requests: Collection, unread: int}
     */
    public function inbox(string $deviceToken): array
    {
        return [
            'notifications' => $this->notifications->forDevice($deviceToken),
            'requests' => $this->requests->forDevice($deviceToken),
            'unread' => $this->notifications->unreadCount($deviceToken),
        ];
    }

    /**
     * Tandai semua notifikasi perangkat sebagai dibaca.
     *
     * @param  string  $deviceToken
     * @return int
     */
    public function markAllRead(string $deviceToken): int
    {
        return $this->notifications->markAllRead($deviceToken);
    }
}
