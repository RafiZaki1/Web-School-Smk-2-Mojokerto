<?php

namespace App\Services\LandingPage;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MajorQuizAiClient
{
    /**
     * Kirim prompt ke penyedia AI yang dikonfigurasi. Mengembalikan null bila belum dikonfigurasi atau gagal.
     */
    public function send(string $system, string $user): ?string
    {
        return match (config('chatbot.provider', 'gemini')) {
            'gemini' => $this->sendGemini($system, $user),
            'openai', 'groq', 'openrouter' => $this->sendOpenAi($system, $user),
            default => null,
        };
    }

    /**
     * Kirim prompt ke Google Gemini dengan keluaran JSON.
     */
    private function sendGemini(string $system, string $user): ?string
    {
        $apiKey = config('chatbot.gemini.api_key');

        if (empty($apiKey)) {
            return null;
        }

        $model = config('chatbot.gemini.model');
        $baseUrl = config('chatbot.gemini.base_url');

        $response = Http::timeout(25)->post("{$baseUrl}/models/{$model}:generateContent?key={$apiKey}", [
            'contents' => [['role' => 'user', 'parts' => [['text' => $user]]]],
            'systemInstruction' => ['parts' => [['text' => $system]]],
            'generationConfig' => [
                'temperature' => 0.2,
                'maxOutputTokens' => 2048,
                'responseMimeType' => 'application/json',
            ],
        ]);

        if (! $response->successful()) {
            Log::warning('MajorQuizMatcher Gemini '.$response->status().': '.Str::limit($response->body(), 300));

            return null;
        }

        return data_get($response->json(), 'candidates.0.content.parts.0.text');
    }

    /**
     * Kirim prompt ke layanan kompatibel OpenAI dengan keluaran JSON.
     */
    private function sendOpenAi(string $system, string $user): ?string
    {
        $apiKey = config('chatbot.openai.api_key');

        if (empty($apiKey)) {
            return null;
        }

        $baseUrl = rtrim(config('chatbot.openai.base_url'), '/');

        $response = Http::withToken($apiKey)->timeout(25)->post("{$baseUrl}/chat/completions", [
            'model' => config('chatbot.openai.model'),
            'messages' => [
                ['role' => 'system', 'content' => $system],
                ['role' => 'user', 'content' => $user],
            ],
            'temperature' => 0.2,
            'max_tokens' => 2048,
            'response_format' => ['type' => 'json_object'],
        ]);

        if (! $response->successful()) {
            Log::warning('MajorQuizMatcher OpenAI '.$response->status().': '.Str::limit($response->body(), 300));

            return null;
        }

        return data_get($response->json(), 'choices.0.message.content');
    }
}
