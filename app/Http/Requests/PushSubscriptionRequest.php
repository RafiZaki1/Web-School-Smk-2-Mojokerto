<?php

namespace App\Http\Requests;

/**
 * Objek PushSubscription dari browser (hasil PushManager.subscribe().toJSON()).
 */
class PushSubscriptionRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi langganan Web Push.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $subscribing = $this->isMethod('post');

        return [
            'endpoint' => ['required', 'url:https', 'max:1000'],
            'keys' => [$subscribing ? 'required' : 'nullable', 'array'],
            'keys.p256dh' => [$subscribing ? 'required' : 'nullable', 'string', 'max:255'],
            'keys.auth' => [$subscribing ? 'required' : 'nullable', 'string', 'max:255'],
            'content_encoding' => ['nullable', 'in:aes128gcm,aesgcm'],
        ];
    }

    /**
     * Ambil pesan galat kustom untuk setiap aturan validasi.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'endpoint.required' => 'Alamat langganan notifikasi wajib dikirim.',
            'endpoint.url' => 'Alamat langganan notifikasi tidak valid.',
            'endpoint.max' => 'Alamat langganan notifikasi terlalu panjang.',
            'keys.required' => 'Kunci langganan notifikasi wajib dikirim.',
            'keys.p256dh.required' => 'Kunci langganan notifikasi tidak lengkap.',
            'keys.auth.required' => 'Kunci langganan notifikasi tidak lengkap.',
            'content_encoding.in' => 'Jenis enkripsi notifikasi tidak didukung.',
        ];
    }
}
