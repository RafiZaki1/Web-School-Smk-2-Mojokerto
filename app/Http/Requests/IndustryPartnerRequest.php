<?php

namespace App\Http\Requests;

use App\Enums\MajorCodeEnum;
use App\Rules\ImageOrPath;
use Illuminate\Validation\Rule;

class IndustryPartnerRequest extends ContentRequest
{
    /** @var array<int, string> */
    protected array $booleans = ['is_active'];

    /**
     * Ambil aturan validasi data mitra DU/DI.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'logo' => ['nullable', new ImageOrPath(2048)],
            'major_codes' => ['nullable', 'array'],
            'major_codes.*' => [Rule::enum(MajorCodeEnum::class)],
            'city' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'url:http,https', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
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
            'name.required' => 'Nama perusahaan wajib diisi.',
            'name.max' => 'Nama perusahaan maksimal :max karakter.',
            'major_codes.array' => 'Jurusan mitra tidak valid.',
            'major_codes.*.enum' => 'Jurusan yang dipilih tidak valid.',
            'city.max' => 'Kota maksimal :max karakter.',
            'website.url' => 'Alamat website harus diawali http:// atau https://.',
            'website.max' => 'Alamat website maksimal :max karakter.',
            'description.max' => 'Deskripsi maksimal :max karakter.',
            'is_active.boolean' => 'Status aktif harus berupa benar atau salah.',
            'sort_order.integer' => 'Urutan harus berupa angka.',
            'sort_order.min' => 'Urutan minimal :min.',
        ];
    }

    /**
     * Ambil nama atribut yang ramah untuk pesan galat.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return ['logo' => 'logo'];
    }
}
