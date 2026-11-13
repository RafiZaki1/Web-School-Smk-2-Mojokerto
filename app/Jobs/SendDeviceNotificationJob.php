<?php

namespace App\Jobs;

use App\Contracts\Interfaces\DeviceNotificationRepositoryInterface;
use App\Contracts\Interfaces\WebPushServiceInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Mengirim notifikasi perubahan status layanan alumni ke layar HP lewat Web Push.
 * Didispatch setelah DB::commit() agar tidak mengirim data yang ternyata di-rollback.
 */
class SendDeviceNotificationJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /** @var array<int, int> */
    public array $backoff = [10, 60];

    /**
     * Buat job untuk satu notifikasi perangkat.
     *
     * @param  int  $notificationId
     */
    public function __construct(public int $notificationId) {}

    /**
     * Kirim notifikasi lalu catat waktu kirimnya.
     *
     * @param  DeviceNotificationRepositoryInterface  $notifications
     * @param  WebPushServiceInterface  $webPush
     * @return void
     */
    public function handle(DeviceNotificationRepositoryInterface $notifications, WebPushServiceInterface $webPush): void
    {
        $notification = $notifications->find($this->notificationId);
        if (! $notification || $notification->pushed_at) {
            return;
        }

        if ($webPush->send($notification) > 0) {
            $notifications->markPushed($notification->id);
        }
    }

    /**
     * Catat kegagalan setelah seluruh percobaan habis.
     *
     * @param  Throwable  $exception
     * @return void
     */
    public function failed(Throwable $exception): void
    {
        Log::error('Web Push gagal dikirim', ['notification_id' => $this->notificationId, 'error' => $exception->getMessage()]);
    }
}
