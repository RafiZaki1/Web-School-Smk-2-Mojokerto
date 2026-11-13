<?php

namespace App\Services\LandingPage;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class ChatbotApiClient
{
    /**
     * Inisialisasi ChatbotApiClient dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected ChatbotFallbackResponder $fallback,
    ) {}

    /**
     * Kirim percakapan ke Google Gemini. Bila gagal, balasan cadangan lokal dikembalikan.
     *
     * @param  array<int, array<string, mixed>>  $history
     * @return array<string, mixed>
     */
    public function gemini(string $message, array $history, string $systemPrompt, string $apiKey): array
    {
        try {
            $model = config('chatbot.gemini.model', 'gemini-1.5-flash');
            $baseUrl = config('chatbot.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');
            $url = "{$baseUrl}/models/{$model}:generateContent?key={$apiKey}";

            $payload = [
                'contents' => $this->geminiContents($message, $history),
                'systemInstruction' => ['parts' => [['text' => $systemPrompt]]],
                'generationConfig' => [
                    'temperature' => config('chatbot.temperature', 0.5),
                    'maxOutputTokens' => config('chatbot.max_tokens', 800),
                ],
            ];

            $response = Http::timeout(25)->post($url, $payload);

            if ($response->successful()) {
                $reply = data_get($response->json(), 'candidates.0.content.parts.0.text');

                if (! empty($reply)) {
                    return ['status' => 'success', 'reply' => trim($reply), 'provider' => 'gemini', 'model' => $model];
                }
            }

            Log::error('Gemini API Error: '.$response->body());

            return $this->fallback->respond($message, 'Gagal mendapatkan respon dari server Gemini AI ('.$response->status().').');
        } catch (Throwable $e) {
            Log::error('ChatbotService Gemini Exception: '.$e->getMessage());

            return $this->fallback->respond($message, 'Terjadi kendala koneksi ke server AI.');
        }
    }

    /**
     * Kirim percakapan ke layanan kompatibel OpenAI (OpenAI, Groq, OpenRouter).
     * Bila gagal, balasan cadangan lokal dikembalikan.
     *
     * @param  array<int, array<string, mixed>>  $history
     * @return array<string, mixed>
     */
    public function openAi(string $message, array $history, string $systemPrompt, string $apiKey): array
    {
        try {
            $model = config('chatbot.openai.model', 'gpt-4o-mini');
            $baseUrl = rtrim(config('chatbot.openai.base_url', 'https://api.openai.com/v1'), '/');

            $payload = [
                'model' => $model,
                'messages' => $this->openAiMessages($message, $history, $systemPrompt),
                'temperature' => config('chatbot.temperature', 0.5),
                'max_tokens' => config('chatbot.max_tokens', 800),
            ];

            $response = Http::withToken($apiKey)->timeout(25)->post("{$baseUrl}/chat/completions", $payload);

            if ($response->successful()) {
                $reply = data_get($response->json(), 'choices.0.message.content');

                if (! empty($reply)) {
                    return ['status' => 'success', 'reply' => trim($reply), 'provider' => 'openai', 'model' => $model];
                }
            }

            Log::error('OpenAI API Error: '.$response->body());

            return $this->fallback->respond($message, 'Gagal mendapatkan respon dari server OpenAI ('.$response->status().').');
        } catch (Throwable $e) {
            Log::error('ChatbotService OpenAI Exception: '.$e->getMessage());

            return $this->fallback->respond($message, 'Terjadi kendala koneksi ke server AI.');
        }
    }

    /**
     * Susun konten Gemini dari riwayat percakapan dan pesan terbaru.
     *
     * @param  array<int, array<string, mixed>>  $history
     * @return array<int, array<string, mixed>>
     */
    private function geminiContents(string $message, array $history): array
    {
        $contents = [];

        foreach ($history as $item) {
            $text = $this->historyText($item);

            if ($text !== '') {
                $contents[] = [
                    'role' => $this->historyRole($item, 'model'),
                    'parts' => [['text' => $text]],
                ];
            }
        }

        $contents[] = ['role' => 'user', 'parts' => [['text' => $message]]];

        return $contents;
    }

    /**
     * Susun daftar pesan OpenAI dari instruksi sistem, riwayat, dan pesan terbaru.
     *
     * @param  array<int, array<string, mixed>>  $history
     * @return array<int, array<string, string>>
     */
    private function openAiMessages(string $message, array $history, string $systemPrompt): array
    {
        $messages = [['role' => 'system', 'content' => $systemPrompt]];

        foreach ($history as $item) {
            $text = $this->historyText($item);

            if ($text !== '') {
                $messages[] = ['role' => $this->historyRole($item, 'assistant'), 'content' => $text];
            }
        }

        $messages[] = ['role' => 'user', 'content' => $message];

        return $messages;
    }

    /**
     * Ambil teks dari satu item riwayat, baik dari kolom content maupun text.
     *
     * @param  array<string, mixed>  $item
     */
    private function historyText(array $item): string
    {
        return trim((string) ($item['content'] ?? $item['text'] ?? ''));
    }

    /**
     * Tentukan peran item riwayat: balasan bot dipetakan ke peran asisten, selain itu pengguna.
     *
     * @param  array<string, mixed>  $item
     */
    private function historyRole(array $item, string $assistantRole): string
    {
        $role = $item['role'] ?? 'user';

        return in_array($role, ['bot', 'model', 'assistant'], true) ? $assistantRole : 'user';
    }
}
