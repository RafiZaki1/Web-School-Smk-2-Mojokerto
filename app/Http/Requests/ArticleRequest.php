<?php

namespace App\Http\Requests;

use App\Enums\ArticleCategoryEnum;
use App\Rules\ImageOrPath;
use Illuminate\Validation\Rule;

class ArticleRequest extends ContentRequest
{
    /**
     * Ambil aturan validasi data berita dan artikel.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'category' => [$this->requiredOnCreate(), Rule::enum(ArticleCategoryEnum::class)],
            'author' => ['nullable', 'string', 'max:255'],
            'published_at' => ['nullable', 'date'],
            'cover_image' => ['nullable', new ImageOrPath],
            'body' => [$this->requiredOnCreate(), 'string', 'min:20'],
            'gallery' => ['nullable', 'array', 'max:20'],
            'gallery.*' => ['nullable', new ImageOrPath],
            'is_published' => ['nullable', 'boolean'],
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
            'title.required' => 'Judul berita wajib diisi.',
            'title.string' => 'Judul berita harus berupa teks.',
            'title.max' => 'Judul berita maksimal :max karakter.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal :max karakter.',
            'category.required' => 'Kategori wajib dipilih.',
            'category.enum' => 'Kategori yang dipilih tidak valid.',
            'author.string' => 'Nama penulis harus berupa teks.',
            'author.max' => 'Nama penulis maksimal :max karakter.',
            'published_at.date' => 'Tanggal terbit tidak valid.',
            'body.required' => 'Isi berita wajib diisi.',
            'body.string' => 'Isi berita harus berupa teks.',
            'body.min' => 'Isi berita minimal :min karakter.',
            'gallery.array' => 'Galeri harus berupa daftar foto.',
            'gallery.max' => 'Galeri maksimal :max foto.',
            'is_published.boolean' => 'Status terbit harus berupa benar atau salah.',
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
            'title' => 'judul berita',
            'category' => 'kategori',
            'body' => 'isi berita',
            'cover_image' => 'foto sampul',
            'gallery.*' => 'foto galeri',
        ];
    }
}
