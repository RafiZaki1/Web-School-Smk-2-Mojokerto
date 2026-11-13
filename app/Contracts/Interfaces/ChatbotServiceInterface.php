<?php

namespace App\Contracts\Interfaces;

interface ChatbotServiceInterface
{
    /**
     * Send a user message to the AI chatbot and get a reply.
     */
    public function sendMessage(string $message, array $history = []): array;
}
