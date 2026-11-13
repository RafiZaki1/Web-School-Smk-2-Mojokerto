<?php

namespace App\Http\Requests;

class ChatbotMessageRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi pesan chatbot. Kolom sada_security_code adalah jebakan bot dan harus kosong.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'min:2', 'max:400'],
            'history' => ['nullable', 'array', 'max:'.config('chatbot.max_history')],
            'history.*.role' => ['nullable', 'string', 'in:user,bot,model,assistant'],
            'history.*.content' => ['nullable', 'string', 'max:2000'],
            'sada_security_code' => ['prohibited'],
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
            'message.required' => 'Pesan wajib diisi.',
            'message.string' => 'Pesan harus berupa teks.',
            'message.min' => 'Pesan minimal :min karakter.',
            'message.max' => 'Pesan maksimal :max karakter.',
            'history.array' => 'Riwayat percakapan harus berupa daftar.',
            'history.max' => 'Riwayat percakapan maksimal :max pesan.',
            'history.*.role.in' => 'Peran pada riwayat percakapan tidak valid.',
            'history.*.content.max' => 'Isi riwayat percakapan maksimal :max karakter.',
            'sada_security_code.prohibited' => 'Permintaan tidak valid terdeteksi.',
        ];
    }
}
