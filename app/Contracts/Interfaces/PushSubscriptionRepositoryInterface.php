<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;

/**
 * Langganan Web Push per perangkat (satu perangkat bisa punya beberapa browser).
 */
interface PushSubscriptionRepositoryInterface
{
    /**
     * Kontrak method upsertSubscription.
     *
     * @param  array<string, mixed>  $data
     * @return int
     */
    public function upsertSubscription(array $data): int;

    /**
     * Kontrak method forDevice.
     *
     * @param  string  $deviceToken
     * @return Collection
     */
    public function forDevice(string $deviceToken): Collection;

    /**
     * Kontrak method deleteForDevice.
     *
     * @param  string  $deviceToken
     * @param  string  $endpointHash
     * @return int
     */
    public function deleteForDevice(string $deviceToken, string $endpointHash): int;

    /**
     * Kontrak method deleteByHashes.
     *
     * @param  array<int, string>  $endpointHashes
     * @return int
     */
    public function deleteByHashes(array $endpointHashes): int;
}
