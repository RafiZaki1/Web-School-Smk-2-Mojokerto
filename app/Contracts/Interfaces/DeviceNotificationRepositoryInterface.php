<?php

namespace App\Contracts\Interfaces;

use App\Models\DeviceNotification;
use Illuminate\Database\Eloquent\Collection;

/**
 * Isi ikon lonceng per perangkat.
 */
interface DeviceNotificationRepositoryInterface
{
    /**
     * Kontrak method store.
     *
     * @param  array<string, mixed>  $data
     * @return DeviceNotification
     */
    public function store(array $data): DeviceNotification;

    /**
     * Kontrak method find.
     *
     * @param  int  $id
     * @return ?DeviceNotification
     */
    public function find(int $id): ?DeviceNotification;

    /**
     * Kontrak method forDevice.
     *
     * @param  string  $deviceToken
     * @param  int  $limit
     * @return Collection
     */
    public function forDevice(string $deviceToken, int $limit = 20): Collection;

    /**
     * Kontrak method unreadCount.
     *
     * @param  string  $deviceToken
     * @return int
     */
    public function unreadCount(string $deviceToken): int;

    /**
     * Kontrak method markAllRead.
     *
     * @param  string  $deviceToken
     * @return int
     */
    public function markAllRead(string $deviceToken): int;

    /**
     * Kontrak method markPushed.
     *
     * @param  int  $id
     * @return int
     */
    public function markPushed(int $id): int;
}
