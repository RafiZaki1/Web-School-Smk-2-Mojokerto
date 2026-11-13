<?php

namespace App\Contracts\Interfaces;

use App\Models\DeviceNotification;

/**
 * Pengiriman Web Push ke browser perangkat pengaju (notifikasi di bar layar HP).
 */
interface WebPushServiceInterface
{
    /**
     * Kontrak method isConfigured.
     *
     * @return bool
     */
    public function isConfigured(): bool;

    /**
     * Kontrak method publicKey.
     *
     * @return ?string
     */
    public function publicKey(): ?string;

    /**
     * Kontrak method subscribe.
     *
     * @param  array<string, mixed>  $subscription
     * @param  string  $deviceToken
     * @param  ?string  $userAgent
     * @return int
     */
    public function subscribe(string $deviceToken, array $subscription, ?string $userAgent): int;

    /**
     * Kontrak method unsubscribe.
     *
     * @param  string  $deviceToken
     * @param  string  $endpoint
     * @return int
     */
    public function unsubscribe(string $deviceToken, string $endpoint): int;

    /**
     * Kontrak method send.
     *
     * @param  DeviceNotification  $notification
     * @return int
     */
    public function send(DeviceNotification $notification): int;
}
