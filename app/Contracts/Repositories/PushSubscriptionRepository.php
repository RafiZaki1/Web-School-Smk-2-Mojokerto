<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\PushSubscriptionRepositoryInterface;
use App\Models\PushSubscription;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class PushSubscriptionRepository extends BaseRepository implements PushSubscriptionRepositoryInterface
{
    /** @var class-string<PushSubscription> */
    protected string $model = PushSubscription::class;

    /**
     * Simpan langganan baru atau perbarui kunci/perangkatnya bila endpoint sudah terdaftar.
     * upsert tidak memicu observer, jadi endpoint_hash diisi di sini.
     *
     * @param  array<string, mixed>  $data
     * @return int
     */
    public function upsertSubscription(array $data): int
    {
        $now = Carbon::now();
        $row = [
            ...$data,
            'endpoint_hash' => PushSubscription::hashEndpoint((string) $data['endpoint']),
            'last_used_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ];

        return $this->query()->upsert([$row], ['endpoint_hash'], ['device_token', 'public_key', 'auth_token', 'content_encoding', 'user_agent', 'last_used_at', 'updated_at']);
    }

    /**
     * Ambil seluruh langganan milik satu perangkat.
     *
     * @param  string  $deviceToken
     * @return Collection
     */
    public function forDevice(string $deviceToken): Collection
    {
        return $this->query()->forDevice($deviceToken)->get();
    }

    /**
     * Hapus satu langganan milik perangkat (pengguna mematikan notifikasi).
     *
     * @param  string  $deviceToken
     * @param  string  $endpointHash
     * @return int
     */
    public function deleteForDevice(string $deviceToken, string $endpointHash): int
    {
        return $this->query()->forDevice($deviceToken)->where('endpoint_hash', $endpointHash)->delete();
    }

    /**
     * Hapus langganan yang sudah kedaluwarsa menurut layanan push browser.
     *
     * @param  array<int, string>  $endpointHashes
     * @return int
     */
    public function deleteByHashes(array $endpointHashes): int
    {
        return $endpointHashes === [] ? 0 : $this->query()->whereIn('endpoint_hash', $endpointHashes)->delete();
    }
}
