<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\PushSubscriptionRepositoryInterface;
use App\Contracts\Interfaces\WebPushServiceInterface;
use App\Models\DeviceNotification;
use App\Models\PushSubscription;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

/**
 * Kunci VAPID dibaca dari config services.webpush (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT).
 * Tanpa kunci, notifikasi tetap tampil di lonceng; hanya push ke layar HP yang dilewati.
 */
class WebPushService implements WebPushServiceInterface
{
    /** Notifikasi kedaluwarsa setelah 3 hari bila HP tidak tersambung internet. */
    private const TTL_SECONDS = 259200;

    /**
     * Inisialisasi WebPushService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  PushSubscriptionRepositoryInterface  $subscriptions
     */
    public function __construct(protected PushSubscriptionRepositoryInterface $subscriptions) {}

    /**
     * Periksa apakah kunci VAPID sudah diatur.
     *
     * @return bool
     */
    public function isConfigured(): bool
    {
        return filled(config('services.webpush.public_key')) && filled(config('services.webpush.private_key'));
    }

    /**
     * Kunci publik VAPID untuk PushManager.subscribe() di browser.
     *
     * @return ?string
     */
    public function publicKey(): ?string
    {
        return $this->isConfigured() ? (string) config('services.webpush.public_key') : null;
    }

    /**
     * Simpan langganan push dari browser perangkat.
     *
     * @param  array<string, mixed>  $subscription
     * @param  string  $deviceToken
     * @param  ?string  $userAgent
     * @return int
     */
    public function subscribe(string $deviceToken, array $subscription, ?string $userAgent): int
    {
        return $this->subscriptions->upsertSubscription([
            'device_token' => $deviceToken,
            'endpoint' => $subscription['endpoint'],
            'public_key' => $subscription['keys']['p256dh'] ?? null,
            'auth_token' => $subscription['keys']['auth'] ?? null,
            'content_encoding' => $subscription['content_encoding'] ?? 'aes128gcm',
            'user_agent' => $userAgent ? mb_substr($userAgent, 0, 255) : null,
        ]);
    }

    /**
     * Hapus langganan push satu browser milik perangkat.
     *
     * @param  string  $deviceToken
     * @param  string  $endpoint
     * @return int
     */
    public function unsubscribe(string $deviceToken, string $endpoint): int
    {
        return $this->subscriptions->deleteForDevice($deviceToken, PushSubscription::hashEndpoint($endpoint));
    }

    /**
     * Kirim notifikasi ke seluruh browser yang berlangganan di perangkat itu. Langganan
     * yang ditolak layanan push (kedaluwarsa) dihapus.
     *
     * @param  DeviceNotification  $notification
     * @return int Jumlah browser yang berhasil dikirimi
     */
    public function send(DeviceNotification $notification): int
    {
        $subscriptions = $this->subscriptions->forDevice($notification->device_token);
        if (! $this->isConfigured() || $subscriptions->isEmpty()) {
            return 0;
        }

        $webPush = new WebPush(['VAPID' => [
            'subject' => config('services.webpush.subject'),
            'publicKey' => config('services.webpush.public_key'),
            'privateKey' => config('services.webpush.private_key'),
        ]], ['TTL' => self::TTL_SECONDS, 'urgency' => 'high']);

        $payload = (string) json_encode([
            'title' => $notification->title,
            'body' => $notification->body,
            'url' => $notification->url,
            'tag' => 'layanan-'.$notification->alumni_service_request_id,
        ]);

        foreach ($subscriptions as $subscription) {
            $webPush->queueNotification(Subscription::create([
                'endpoint' => $subscription->endpoint,
                'publicKey' => $subscription->public_key,
                'authToken' => $subscription->auth_token,
                'contentEncoding' => $subscription->content_encoding,
            ]), $payload);
        }

        return $this->collectReports($webPush);
    }

    /**
     * Baca laporan pengiriman, hapus langganan kedaluwarsa, dan hitung yang berhasil.
     *
     * @param  WebPush  $webPush
     * @return int
     */
    private function collectReports(WebPush $webPush): int
    {
        $sent = 0;
        $expired = [];

        foreach ($webPush->flush() as $report) {
            $sent += $report->isSuccess() ? 1 : 0;
            if ($report->isSubscriptionExpired()) {
                $expired[] = PushSubscription::hashEndpoint($report->getEndpoint());
            }
        }

        $this->subscriptions->deleteByHashes($expired);

        return $sent;
    }
}
