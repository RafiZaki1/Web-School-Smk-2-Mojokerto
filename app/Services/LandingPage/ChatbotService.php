<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\ChatbotServiceInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Chatbot AI Versi Awal — Tahap Seleksi Lomba Web Sekolah
 * 
 * Karakteristik Versi Awal:
 * 1. Menerima pertanyaan pengguna dari website.
 * 2. Terhubung langsung ke API Google Gemini AI.
 * 3. Memberikan respons dasar yang sopan dan relevan.
 * 4. Menyediakan fallback ramah bila koneksi internet/API terkendala.
 */
class ChatbotService implements ChatbotServiceInterface
{
    public function sendMessage(string $message, array $history = []): array
    {
        $apiKey = config('chatbot.gemini.api_key');

        // Jika API Key belum disetel, kembalikan respons dasar ramah
        if (empty($apiKey)) {
            return $this->buildFallbackResponse($message, 'API Key belum disetel.');
        }

        $model = config('chatbot.gemini.model', 'gemini-1.5-flash');
        $baseUrl = rtrim(config('chatbot.gemini.base_url'), '/');
        $url = "{$baseUrl}/models/{$model}:generateContent?key={$apiKey}";

        try {
            $contents = [];

            // Tambahkan riwayat percakapan sederhana jika ada
            foreach ($history as $item) {
                $role = in_array($item['role'] ?? '', ['bot', 'model', 'assistant']) ? 'model' : 'user';
                $text = trim((string) ($item['content'] ?? $item['text'] ?? ''));
                if (!empty($text)) {
                    $contents[] = [
                        'role' => $role,
                        'parts' => [['text' => $text]],
                    ];
                }
            }

            // Tambahkan pesan pengguna saat ini
            $contents[] = [
                'role' => 'user',
                'parts' => [['text' => $message]],
            ];

            $response = Http::timeout(15)->post($url, [
                'systemInstruction' => [
                    'parts' => [['text' => config('chatbot.system_prompt')]],
                ],
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => config('chatbot.temperature', 0.7),
                    'maxOutputTokens' => config('chatbot.max_tokens', 600),
                ],
            ]);

            if ($response->successful()) {
                $reply = $response->json('candidates.0.content.parts.0.text');
                if (!empty($reply)) {
                    return [
                        'status' => 'success',
                        'reply' => trim($reply),
                        'provider' => 'gemini',
                        'model' => $model,
                    ];
                }
            }

            Log::warning('Gemini API Response: ' . $response->body());
            return $this->buildFallbackResponse($message, 'Koneksi API mengembalikan status ' . $response->status());
        } catch (Throwable $e) {
            Log::error('ChatbotService Exception: ' . $e->getMessage());
            return $this->buildFallbackResponse($message, 'Terjadi kendala jaringan ke server AI.');
        }
    }

    /**
     * Respons dasar berbasis informasi umum SMKN 2 Mojokerto
     * sebagai cadangan bila layanan AI sedang offline.
     */
    protected function buildFallbackResponse(string $message, string $note = ''): array
    {
        $text = mb_strtolower($message);

        if (str_contains($text, 'rpl') || str_contains($text, 'rekayasa perangkat lunak') || str_contains($text, 'coding')) {
            $reply = "💻 **Jurusan Rekayasa Perangkat Lunak (RPL)** di SMKN 2 Mojokerto mempelajari pemrograman web, aplikasi mobile, basis data, dan pengembangan perangkat lunak modern.";
        } elseif (str_contains($text, 'dkv') || str_contains($text, 'desain') || str_contains($text, 'animasi')) {
            $reply = "🎨 **Jurusan Desain Komunikasi Visual (DKV)** berfokus pada desain grafis, ilustrasi digital, fotografi studio, videografi, dan animasi.";
        } elseif (str_contains($text, 'aphp') || str_contains($text, 'pertanian') || str_contains($text, 'pangan')) {
            $reply = "🌾 **Jurusan Agribisnis Pengolahan Hasil Pertanian (APHP)** mempelajari teknologi pengolahan hasil panen pangan, kontrol mutu (HACCP), dan pengemasan produk.";
        } elseif (str_contains($text, 'boga') || str_contains($text, 'kuliner') || str_contains($text, 'masak')) {
            $reply = "🍳 **Jurusan Tata Boga / Kuliner** membekali siswa dengan seni memasak masakan nusantara & internasional, pastry & bakery, serta manajemen restoran.";
        } elseif (str_contains($text, 'jurusan')) {
            $reply = "SMK Negeri 2 Kota Mojokerto memiliki 4 program keahlian unggulan:\n1. **RPL** (Rekayasa Perangkat Lunak)\n2. **DKV** (Desain Komunikasi Visual)\n3. **APHP** (Agribisnis Pengolahan Hasil Pertanian)\n4. **Tata Boga / Kuliner**";
        } elseif (str_contains($text, 'ppdb') || str_contains($text, 'daftar') || str_contains($text, 'syarat')) {
            $reply = "📋 Informasi PPDB SMKN 2 Mojokerto membuka beberapa jalur penerimaan seperti Jalur Afirmasi, Prestasi, Perpindahan Tugas Orang Tua, dan Zonasi SMK.";
        } elseif (str_contains($text, 'halo') || str_contains($text, 'hai') || str_contains($text, 'pagi') || str_contains($text, 'siang') || str_contains($text, 'sore') || str_contains($text, 'malam')) {
            $reply = "Halo! 👋 Saya SADA, asisten virtual SMK Negeri 2 Kota Mojokerto. Ada yang bisa saya bantu seputar informasi sekolah kami? 😊";
        } else {
            $reply = "Halo! Saya SADA, asisten virtual SMKN 2 Mojokerto. Terima kasih telah menghubungi kami. Anda dapat bertanya seputar jurusan (RPL, DKV, APHP, Tata Boga), fasilitas, kegiatan siswa, atau pendaftaran sekolah. 😊";
        }

        return [
            'status' => 'fallback',
            'reply' => $reply,
            'note' => $note,
        ];
    }
}
