<?php

namespace App\Services\LandingPage;

use App\Exceptions\RequestBlockedException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class ChatbotGuard
{
    /** @var array<int, string> */
    private const PROFANITY = [
        'anjing', 'babi', 'bangsat', 'kontol', 'memek', 'jembut', 'tolol', 'goblok',
        'bajingan', 'pantek', 'kampret', 'asu', 'bgst', 'idiot', 'lonte', 'ngentot',
    ];

    /**
     * Inisialisasi ChatbotGuard dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected AiUsageLimiter $aiUsage,
    ) {}

    /**
     * Pastikan pesan tidak datang terlalu cepat, berulang, atau berupa karakter tak wajar.
     *
     * @throws RequestBlockedException
     */
    public function ensureNotSpam(string $ip, string $message): void
    {
        if (Cache::has($this->cooldownKey($ip))) {
            throw new RequestBlockedException(trans('alert.chatbot_cooldown'), Response::HTTP_TOO_MANY_REQUESTS, ['retry_after' => 3]);
        }

        $shortLimitKey = $this->shortLimitKey($ip);
        if (RateLimiter::tooManyAttempts($shortLimitKey, 5)) {
            $seconds = RateLimiter::availableIn($shortLimitKey);

            throw new RequestBlockedException(
                trans('alert.chatbot_short_limit', ['seconds' => $seconds]),
                Response::HTTP_TOO_MANY_REQUESTS,
                ['retry_after' => $seconds]
            );
        }

        $hourlyLimitKey = $this->hourlyLimitKey($ip);
        if (RateLimiter::tooManyAttempts($hourlyLimitKey, 40)) {
            throw new RequestBlockedException(
                trans('alert.chatbot_hourly_limit'),
                Response::HTTP_TOO_MANY_REQUESTS,
                ['retry_after' => RateLimiter::availableIn($hourlyLimitKey)]
            );
        }

        if (Cache::has($this->messageHashKey($ip, $message))) {
            throw new RequestBlockedException(trans('alert.chatbot_duplicate'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (preg_match('/(.)\1{7,}/u', $message)) {
            throw new RequestBlockedException(trans('alert.chatbot_gibberish'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Periksa apakah pesan mengandung kata kasar atau provokatif.
     */
    public function containsProfanity(string $message): bool
    {
        foreach (self::PROFANITY as $word) {
            if (stripos($message, $word) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Balasan lembut untuk pesan yang mengandung kata kasar.
     *
     * @return array<string, string>
     */
    public function gentleReply(): array
    {
        return [
            'status' => 'gentle_guard',
            'reply' => "Mohon maaf dengan penuh hormat, SADA siap membantu menjawab informasi positif seputar **SMK Negeri 2 Kota Mojokerto** dengan tutur kata yang santun dan bersahabat 😊.\n\nAda yang bisa kami bantu terkait informasi jurusan, fasilitas, atau pendaftaran PPDB?",
            'provider' => 'guard',
        ];
    }

    /**
     * Catat pesan yang lolos pemeriksaan agar cooldown, batas laju, dan duplikasi berlaku.
     */
    public function remember(string $ip, string $message): void
    {
        Cache::put($this->cooldownKey($ip), true, 3);
        RateLimiter::hit($this->shortLimitKey($ip), 30);
        RateLimiter::hit($this->hourlyLimitKey($ip), 3600);
        Cache::put($this->messageHashKey($ip, $message), true, 45);
    }

    /**
     * Pastikan batas harian per IP dan total situs belum habis sebelum memanggil API AI.
     *
     * @throws RequestBlockedException
     */
    public function enforceDailyLimits(string $ip): void
    {
        $reason = $this->aiUsage->allow(
            'chatbot',
            $ip,
            config('chatbot.daily_limit_per_ip'),
            config('chatbot.daily_limit_total')
        );

        $retryAfter = now()->diffInSeconds(now()->endOfDay());

        if ($reason === 'ip') {
            throw new RequestBlockedException(trans('alert.chatbot_daily_ip'), Response::HTTP_TOO_MANY_REQUESTS, ['retry_after' => $retryAfter]);
        }

        if ($reason === 'total') {
            throw new RequestBlockedException(trans('alert.chatbot_daily_total'), Response::HTTP_TOO_MANY_REQUESTS, ['retry_after' => $retryAfter]);
        }
    }

    /**
     * Kunci cache jeda minimal antar pesan untuk satu IP.
     */
    private function cooldownKey(string $ip): string
    {
        return 'chatbot_last_req:'.$ip;
    }

    /**
     * Kunci penghitung batas laju jangka pendek untuk satu IP.
     */
    private function shortLimitKey(string $ip): string
    {
        return 'chatbot_short:'.$ip;
    }

    /**
     * Kunci penghitung batas laju per jam untuk satu IP.
     */
    private function hourlyLimitKey(string $ip): string
    {
        return 'chatbot_hourly:'.$ip;
    }

    /**
     * Kunci cache untuk mendeteksi pesan yang sama dari IP yang sama.
     */
    private function messageHashKey(string $ip, string $message): string
    {
        return 'chatbot_msg_hash:'.md5($ip.'_'.strtolower($message));
    }
}
