<?php

namespace App\Http\Requests\Content;

use App\Models\Aspiration;
use Illuminate\Validation\Rule;

/** Formulir publik Kotak Aspirasi. */
class StoreAspirationRequest extends ContentRequest
{
    protected array $booleans = ['is_anonymous'];

    public function rules(): array
    {
        return [
            'category' => ['required', Rule::in(Aspiration::CATEGORIES)],
            'title' => ['required', 'string', 'max:150'],
            'detail' => ['required', 'string', 'min:10', 'max:5000'],
            'is_anonymous' => ['nullable', 'boolean'],
            'sender_name' => ['nullable', 'required_if:is_anonymous,false', 'string', 'max:150'],
            'photos' => ['nullable', 'array', 'max:3'],
            'photos.*' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:3072'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul singkat wajib diisi.',
            'detail.required' => 'Ceritakan detailnya minimal 10 karakter.',
            'detail.min' => 'Ceritakan detailnya minimal 10 karakter.',
            'sender_name.required_if' => 'Isi nama & kelas bila tidak mengirim secara anonim.',
            'photos.*.max' => 'Ukuran foto maksimal 3 MB.',
        ];
    }
}
