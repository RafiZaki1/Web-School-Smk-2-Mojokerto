<?php

/*
 * Tripay closed payment, disalin dari api-getskill. Sandbox: https://tripay.co.id/api-sandbox/
 * Produksi: https://tripay.co.id/api/ (akhiri dengan garis miring).
 * Callback URL di dashboard Tripay: {APP_URL}/api/bank-mini/webhook
 */
return [
    'callback_token' => env('TRIPAY_CALLBACK_TOKEN'),
    'api_key' => env('TRIPAY_API_KEY'),
    'private_key' => env('TRIPAY_PRIVATE_KEY'),
    'api_url' => env('TRIPAY_API_URL', 'https://tripay.co.id/api-sandbox/'),
    'merchant_code' => env('TRIPAY_MERCHANT_CODE'),
];
