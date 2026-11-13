<?php

namespace App\Http\Requests;

class UpdateSchoolProfileRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi profil sekolah.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'school_name' => ['sometimes', 'required', 'string', 'max:255'],
            'school_logo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'principal_name' => ['nullable', 'string', 'max:255'],
            'principal_position' => ['nullable', 'string', 'max:255'],
            'principal_photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'welcome_message' => ['nullable', 'string'],
            'background_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'established_year' => ['nullable', 'integer', 'min:1800', 'max:2100'],
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
            'school_name.required' => 'Nama sekolah wajib diisi.',
            'school_name.string' => 'Nama sekolah harus berupa teks.',
            'school_name.max' => 'Nama sekolah maksimal :max karakter.',
            'school_logo.image' => 'Logo sekolah harus berupa gambar.',
            'school_logo.mimes' => 'Logo sekolah harus berformat JPG, PNG, atau WEBP.',
            'school_logo.max' => 'Ukuran logo sekolah maksimal 5 MB.',
            'principal_name.string' => 'Nama kepala sekolah harus berupa teks.',
            'principal_name.max' => 'Nama kepala sekolah maksimal :max karakter.',
            'principal_position.string' => 'Jabatan kepala sekolah harus berupa teks.',
            'principal_position.max' => 'Jabatan kepala sekolah maksimal :max karakter.',
            'principal_photo.image' => 'Foto kepala sekolah harus berupa gambar.',
            'principal_photo.mimes' => 'Foto kepala sekolah harus berformat JPG, PNG, atau WEBP.',
            'principal_photo.max' => 'Ukuran foto kepala sekolah maksimal 5 MB.',
            'welcome_message.string' => 'Sambutan harus berupa teks.',
            'background_image.image' => 'Latar belakang harus berupa gambar.',
            'background_image.mimes' => 'Latar belakang harus berformat JPG, PNG, atau WEBP.',
            'background_image.max' => 'Ukuran latar belakang maksimal 5 MB.',
            'established_year.integer' => 'Tahun berdiri harus berupa angka.',
            'established_year.min' => 'Tahun berdiri minimal :min.',
            'established_year.max' => 'Tahun berdiri maksimal :max.',
        ];
    }
}
