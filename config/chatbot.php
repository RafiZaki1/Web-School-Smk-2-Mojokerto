<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Chatbot AI — Versi Awal (Tahap Seleksi Lomba)
    |--------------------------------------------------------------------------
    |
    | Terhubung ke Google Gemini AI via REST API.
    | Dikonfigurasi sederhana, cepat, dan memberikan respons dasar yang ramah.
    |
    */
    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-1.5-flash'),
        'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
    ],

    'system_prompt' => env(
        'CHATBOT_SYSTEM_PROMPT',
        'Kamu adalah SADA, asisten virtual ramah dari SMK Negeri 2 Kota Mojokerto (SKANEDA). '
        . 'Jawab pertanyaan pengunjung seputar sekolah (RPL, DKV, APHP, Tata Boga, fasilitas, PPDB) '
        . 'dan pertanyaan umum dengan sopan, ringkas, jelas, dan ramah dalam bahasa Indonesia.'
    ),

    'max_tokens' => (int) env('CHATBOT_MAX_TOKENS', 600),
    'temperature' => (float) env('CHATBOT_TEMPERATURE', 0.7),
];
