<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\ChatbotServiceInterface;

class ChatbotService implements ChatbotServiceInterface
{
    /**
     * Inisialisasi ChatbotService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected ChatbotPromptBuilder $promptBuilder,
        protected ChatbotApiClient $apiClient,
        protected ChatbotFallbackResponder $fallback,
    ) {}

    /**
     * Kirim pesan pengguna ke penyedia AI yang dikonfigurasi, atau ke balasan cadangan bila tidak tersedia.
     *
     * @param  array<int, array<string, mixed>>  $history
     * @return array<string, mixed>
     */
    public function sendMessage(string $message, array $history = []): array
    {
        $provider = config('chatbot.provider', 'gemini');
        $systemPrompt = $this->promptBuilder->build();

        if ($provider === 'gemini') {
            $apiKey = config('chatbot.gemini.api_key');

            if (empty($apiKey)) {
                return $this->fallback->respond($message, 'API Key Gemini belum disetel di file .env (GEMINI_API_KEY).');
            }

            return $this->apiClient->gemini($message, $history, $systemPrompt, $apiKey);
        }

        if (in_array($provider, ['openai', 'groq', 'openrouter'], true)) {
            $apiKey = config('chatbot.openai.api_key');

            if (empty($apiKey)) {
                return $this->fallback->respond($message, 'API Key OpenAI belum disetel di file .env (OPENAI_API_KEY).');
            }

            return $this->apiClient->openAi($message, $history, $systemPrompt, $apiKey);
        }

        return $this->fallback->respond($message, "Provider '{$provider}' tidak dikenali.");
    }
}
