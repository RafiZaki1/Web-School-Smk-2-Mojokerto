<?php

namespace App\Http\Requests;

use App\Enums\TeacherGroupEnum;
use App\Rules\ImageOrPath;
use Illuminate\Validation\Rule;

class TeacherRequest extends ContentRequest
{
    /**
     * Ambil aturan validasi data guru dan tenaga kependidikan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'group' => [$this->requiredOnCreate(), Rule::enum(TeacherGroupEnum::class)],
            'subject' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', new ImageOrPath(2048)],
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
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal :max karakter.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal :max karakter.',
            'position.string' => 'Jabatan harus berupa teks.',
            'position.max' => 'Jabatan maksimal :max karakter.',
            'group.required' => 'Kelompok wajib dipilih.',
            'group.enum' => 'Kelompok yang dipilih tidak valid.',
            'subject.string' => 'Mata pelajaran harus berupa teks.',
            'subject.max' => 'Mata pelajaran maksimal :max karakter.',
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
            'name' => 'nama',
            'position' => 'jabatan',
            'group' => 'kelompok',
            'subject' => 'mata pelajaran/bidang',
            'photo' => 'foto',
        ];
    }
}
