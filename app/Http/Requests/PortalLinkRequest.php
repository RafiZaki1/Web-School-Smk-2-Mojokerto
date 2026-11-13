<?php

namespace App\Http\Requests;

class PortalLinkRequest extends ContentRequest
{
    /** @var array<int, string> */
    protected array $booleans = ['is_active'];

    /**
     * Ambil aturan validasi pintasan portal di navbar.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'label' => ['sometimes', 'required', 'string', 'max:100'],
            'url' => ['sometimes', 'required', 'url:http,https', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
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
            'label.required' => 'Label tombol wajib diisi.',
            'label.max' => 'Label tombol maksimal :max karakter.',
            'url.required' => 'Alamat tujuan wajib diisi.',
            'url.url' => 'Alamat tujuan harus diawali http:// atau https://.',
            'url.max' => 'Alamat tujuan maksimal :max karakter.',
            'is_active.boolean' => 'Status aktif harus berupa benar atau salah.',
        ];
    }
}
