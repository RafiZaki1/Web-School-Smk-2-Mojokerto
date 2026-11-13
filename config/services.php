<?php

return [

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'frontend' => [
        // IP server Next.js yang mengambil data saat render/build; dibebaskan dari batas request publik
        'server_ips' => array_values(array_filter(array_map('trim', explode(',', (string) env('FRONTEND_SERVER_IPS', '127.0.0.1,::1'))))),
    ],

    // Web Push layanan alumni. Buat kunci sekali: php artisan tinker -> Minishlink\WebPush\VAPID::createVapidKeys()
    'webpush' => [
        'subject' => env('VAPID_SUBJECT', 'mailto:smkn2mr@gmail.com'),
        'public_key' => env('VAPID_PUBLIC_KEY'),
        'private_key' => env('VAPID_PRIVATE_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
