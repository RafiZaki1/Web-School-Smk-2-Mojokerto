<?php

return [

    'provider' => env('CHATBOT_PROVIDER', 'gemini'),

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-3.5-flash-lite'),
        'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
    ],

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
        'base_url' => env('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
    ],

    'system_prompt_prefix' => env('CHATBOT_SYSTEM_PROMPT', 'Kamu adalah asisten virtual cerdas dan ramah untuk website sekolah.'),
    'max_tokens' => (int) env('CHATBOT_MAX_TOKENS', 800),
    'temperature' => (float) env('CHATBOT_TEMPERATURE', 0.7),

    'daily_limit_per_ip' => (int) env('CHATBOT_DAILY_LIMIT_PER_IP', 50),
    'daily_limit_total' => (int) env('CHATBOT_DAILY_LIMIT_TOTAL', 1000),
    'max_history' => (int) env('CHATBOT_MAX_HISTORY', 10),
];
