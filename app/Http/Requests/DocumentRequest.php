<?php

namespace App\Http\Requests;

use App\Enums\DocumentCategoryEnum;
use App\Enums\DocumentExtensionEnum;
use App\Rules\ImageOrPath;
use Illuminate\Validation\Rule;

class DocumentRequest extends ContentRequest
{
    /**
     * Ambil aturan validasi data berkas unduhan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', Rule::enum(DocumentCategoryEnum::class)],
            'description' => ['nullable', 'string', 'max:1000'],
            'file' => [$this->requiredOnCreate(), 'required', new ImageOrPath(10240, array_column(DocumentExtensionEnum::cases(), 'value'))],
            'is_published' => ['nullable', 'boolean'],
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
            'title.required' => 'Judul berkas wajib diisi.',
            'title.string' => 'Judul berkas harus berupa teks.',
            'title.max' => 'Judul berkas maksimal :max karakter.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal :max karakter.',
            'category.enum' => 'Kategori yang dipilih tidak valid.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal :max karakter.',
            'file.required' => 'Berkas wajib diunggah.',
            'is_published.boolean' => 'Status terbit harus berupa benar atau salah.',
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
        return [
            'title' => 'judul berkas',
            'category' => 'kategori',
            'file' => 'berkas',
        ];
    }
}
