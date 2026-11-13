<?php

namespace App\Http\Requests;

use Illuminate\Validation\Validator;

class RouteRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi pencarian rute antarlokasi.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'from' => ['required', 'string'],
            'to' => ['required', 'string'],
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
            'from.required' => 'Lokasi asal (from) wajib diisi.',
            'from.string' => 'Lokasi asal (from) harus berupa teks.',
            'to.required' => 'Lokasi tujuan (to) wajib diisi.',
            'to.string' => 'Lokasi tujuan (to) harus berupa teks.',
        ];
    }

    /**
     * Tambahkan pemeriksaan bahwa lokasi asal dan tujuan tidak sama.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $from = $this->input('from');
            $to = $this->input('to');

            if ($from && $to && strtolower(trim((string) $from)) === strtolower(trim((string) $to))) {
                $validator->errors()->add('to', 'Lokasi asal dan tujuan tidak boleh sama.');
            }
        });
    }
}
