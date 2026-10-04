<?php

namespace App\Contracts\Interfaces;

interface ChatbotServiceInterface
{
    /**
     * Kirim pertanyaan pengguna ke layanan AI dan kembalikan respon dasar.
     *
     * @param string $message
     * @param array $history
     * @return array
     */
    public function sendMessage(string $message, array $history = []): array;
}
