<?php

namespace App\Http\Requests\Content;

use App\Models\Article;
use App\Rules\ImageOrPath;
use Illuminate\Validation\Rule;

class ArticleRequest extends ContentRequest
{
    public function rules(): array
    {
        return [
            'title' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'category' => [$this->requiredOnCreate(), Rule::in(Article::CATEGORIES)],
            'author' => ['nullable', 'string', 'max:255'],
            'published_at' => ['nullable', 'date'],
            'cover_image' => ['nullable', new ImageOrPath],
            'body' => [$this->requiredOnCreate(), 'string', 'min:20'],
            'gallery' => ['nullable', 'array', 'max:20'],
            'gallery.*' => ['nullable', new ImageOrPath],
            'is_published' => ['nullable', 'boolean'],
        ];
    }

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
