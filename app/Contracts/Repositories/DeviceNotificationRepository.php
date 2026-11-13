<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\DeviceNotificationRepositoryInterface;
use App\Models\DeviceNotification;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class DeviceNotificationRepository extends BaseRepository implements DeviceNotificationRepositoryInterface
{
    /** @var class-string<DeviceNotification> */
    protected string $model = DeviceNotification::class;

    /**
     * Simpan notifikasi baru untuk satu perangkat.
     *
     * @param  array<string, mixed>  $data
     * @return DeviceNotification
     */
    public function store(array $data): DeviceNotification
    {
        /** @var DeviceNotification */
        return $this->query()->create($data);
    }

    /**
     * Cari notifikasi berdasarkan id.
     *
     * @param  int  $id
     * @return ?DeviceNotification
     */
    public function find(int $id): ?DeviceNotification
    {
        /** @var DeviceNotification|null */
        return $this->query()->find($id);
    }

    /**
     * Ambil notifikasi terbaru milik satu perangkat.
     *
     * @param  string  $deviceToken
     * @param  int  $limit
     * @return Collection
     */
    public function forDevice(string $deviceToken, int $limit = 20): Collection
    {
        return $this->query()->forDevice($deviceToken)->latest('id')->limit($limit)->get();
    }

    /**
     * Hitung notifikasi yang belum dibaca di satu perangkat.
     *
     * @param  string  $deviceToken
     * @return int
     */
    public function unreadCount(string $deviceToken): int
    {
        return $this->query()->forDevice($deviceToken)->unread()->count();
    }

    /**
     * Tandai seluruh notifikasi perangkat sebagai dibaca.
     *
     * @param  string  $deviceToken
     * @return int
     */
    public function markAllRead(string $deviceToken): int
    {
        return $this->query()->forDevice($deviceToken)->unread()->update(['read_at' => Carbon::now()]);
    }

    /**
     * Catat waktu notifikasi dikirim lewat Web Push, sekali saja.
     *
     * @param  int  $id
     * @return int
     */
    public function markPushed(int $id): int
    {
        return $this->query()->whereKey($id)->whereNull('pushed_at')->update(['pushed_at' => Carbon::now()]);
    }
}
