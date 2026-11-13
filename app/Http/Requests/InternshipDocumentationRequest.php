<?php

namespace App\Http\Requests;

use App\Enums\MajorCodeEnum;
use App\Rules\ImageOrPath;
use Illuminate\Validation\Rule;

class InternshipDocumentationRequest extends ContentRequest
{
    /**
     * Ambil aturan validasi foto dokumentasi kegiatan PKL.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => [$this->requiredOnCreate(), new ImageOrPath(4096)],
            'major_code' => ['nullable', Rule::enum(MajorCodeEnum::class)],
            'industry_partner_id' => ['nullable', 'integer', 'exists:industry_partners,id'],
            'activity_date' => ['nullable', 'date_format:Y-m-d'],
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
            'title.required' => 'Judul kegiatan wajib diisi.',
            'title.max' => 'Judul kegiatan maksimal :max karakter.',
            'description.max' => 'Keterangan maksimal :max karakter.',
            'image.required' => 'Foto kegiatan wajib diunggah.',
            'major_code.enum' => 'Jurusan yang dipilih tidak valid.',
            'industry_partner_id.exists' => 'Mitra yang dipilih tidak ditemukan.',
            'industry_partner_id.integer' => 'Mitra yang dipilih tidak valid.',
            'activity_date.date_format' => 'Tanggal kegiatan harus berformat tahun-bulan-tanggal.',
            'is_published.boolean' => 'Status tampil harus berupa benar atau salah.',
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
        return ['image' => 'foto kegiatan'];
    }
}
