<?php

namespace App\Http\Requests;

class SchoolRuleRequest extends ContentRequest
{
    /** @var array<int, string> */
    protected array $booleans = ['is_active'];

    /**
     * Ambil aturan validasi poin tata tertib siswa.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'section' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'content' => [$this->requiredOnCreate(), 'string', 'max:2000'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
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
            'section.required' => 'Bagian tata tertib wajib diisi.',
            'section.max' => 'Bagian tata tertib maksimal :max karakter.',
            'content.required' => 'Isi aturan wajib diisi.',
            'content.max' => 'Isi aturan maksimal :max karakter.',
            'is_active.boolean' => 'Status aktif harus berupa benar atau salah.',
            'sort_order.integer' => 'Urutan harus berupa angka.',
            'sort_order.min' => 'Urutan minimal :min.',
        ];
    }
}
