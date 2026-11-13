<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;

/**
 * Isi ikon lonceng di navbar: notifikasi dan status pengajuan milik perangkat itu sendiri.
 */
interface DeviceInboxServiceInterface
{
    /**
     * Kontrak method inbox.
     *
     * @param  string  $deviceToken
     * @return array{notifications: Collection, requests: Collection, unread: int}
     */
    public function inbox(string $deviceToken): array;

    /**
     * Kontrak method markAllRead.
     *
     * @param  string  $deviceToken
     * @return int
     */
    public function markAllRead(string $deviceToken): int;
}
