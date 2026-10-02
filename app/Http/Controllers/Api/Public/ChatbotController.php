<?php

namespace App\Http\Controllers\Api\Public;

use App\Contracts\Interfaces\ChatbotServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ChatbotController extends Controller
{
    public function __construct(
        protected ChatbotServiceInterface $chatbotService
    ) {}

    /**
     * Send message to Chatbot with multi-layer anti-spam security.
     */
    public function send(Request $request): JsonResponse
    {
        // 1. Layer 1 Anti-Bot: Honeypot Trap Check
        if (!empty($request->input('sada_security_code'))) {
            return ApiResponse::error(
                'Permintaan tidak valid terdeteksi.',
                null,
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $ip = $request->ip() ?? 'unknown';

        // 2. Layer 2 Anti-Spam: Interval Cooldown Check (Min 3 detik antar pesan per IP)
        $lastRequestKey = 'chatbot_last_req:' . $ip;
        if (Cache::has($lastRequestKey)) {
            return ApiResponse::error(
                'Mohon tunggu beberapa saat lagi ya, SADA sedang memproses pesan Anda...',
                ['retry_after' => 3],
                Response::HTTP_TOO_MANY_REQUESTS
            );
        }

        // 3. Layer 3 Anti-Spam: Rolling Rate Limiter per IP (Max 5 requests per 30 detik & Max 35 per jam)
        $shortLimitKey = 'chatbot_short:' . $ip;
        if (RateLimiter::tooManyAttempts($shortLimitKey, 5)) {
            $seconds = RateLimiter::availableIn($shortLimitKey);
            return ApiResponse::error(
                "Mohon tunggu beberapa saat lagi ({$seconds} detik), SADA sedang menyiapkan jawaban untuk Anda...",
                ['retry_after' => $seconds],
                Response::HTTP_TOO_MANY_REQUESTS
            );
        }

        $hourlyLimitKey = 'chatbot_hourly:' . $ip;
        if (RateLimiter::tooManyAttempts($hourlyLimitKey, 40)) {
            $seconds = RateLimiter::availableIn($hourlyLimitKey);
            return ApiResponse::error(
                "Batas interaksi wajar tercapai. Mohon tunggu beberapa saat lagi ya agar SADA dapat melayani kembali.",
                ['retry_after' => $seconds],
                Response::HTTP_TOO_MANY_REQUESTS
            );
        }

        $validated = $request->validate([
            'message' => 'required|string|min:2|max:400',
            'history' => 'nullable|array',
            'history.*.role' => 'nullable|string|in:user,bot,model,assistant',
            'history.*.content' => 'nullable|string|max:2000',
        ]);

        $message = trim($validated['message']);

        // 4. Layer 4 Anti-Spam: Duplicate Message Check (45 detik per IP)
        $hashKey = 'chatbot_msg_hash:' . md5($ip . '_' . strtolower($message));
        if (Cache::has($hashKey)) {
            return ApiResponse::error(
                'Pertanyaan yang sama baru saja diajukan. Mohon variasikan pertanyaan Anda atau tunggu sejenak.',
                null,
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        // 5. Layer 5 Anti-Spam: Gibberish & Character Flooding Check (e.g. aaaaaaa, 1111111)
        if (preg_match('/(.)\1{7,}/u', $message)) {
            return ApiResponse::error(
                'Pesan mengandung karakter berulang yang tidak wajar. Mohon tuliskan pertanyaan yang jelas.',
                null,
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        // 6. Layer 6: Filter Kata Kasar / Negatif / Provokatif
        $toxicPatterns = [
            'anjing', 'babi', 'bangsat', 'kontol', 'memek', 'jembut', 'tolol', 'goblok',
            'bajingan', 'pantek', 'kampret', 'asu', 'bgst', 'idiot', 'lonte', 'ngentot'
        ];
        foreach ($toxicPatterns as $word) {
            if (stripos($message, $word) !== false) {
                return ApiResponse::success([
                    'status' => 'gentle_guard',
                    'reply' => "Mohon maaf dengan penuh hormat, SADA siap membantu menjawab informasi positif seputar **SMK Negeri 2 Kota Mojokerto** dengan tutur kata yang santun dan bersahabat 😊.\n\nAda yang bisa kami bantu terkait informasi jurusan, fasilitas, atau pendaftaran PPDB?",
                    'provider' => 'guard'
                ], 'Guard response returned');
            }
        }

        // Set Cooldown (3 detik), Hit Rate Limiter & Simpan Hash
        Cache::put($lastRequestKey, true, 3);
        RateLimiter::hit($shortLimitKey, 30);
        RateLimiter::hit($hourlyLimitKey, 3600);
        Cache::put($hashKey, true, 45);

        try {
            $history = $validated['history'] ?? [];
            $result = $this->chatbotService->sendMessage($message, $history);

            return ApiResponse::success(
                $result,
                'Chatbot response received successfully'
            );
        } catch (Throwable $th) {
            return ApiResponse::error(
                'Gagal memproses pesan: ' . $th->getMessage(),
                null,
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
