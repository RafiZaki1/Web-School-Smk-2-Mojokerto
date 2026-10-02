<?php

namespace App\Http\Requests\Content;

use App\Rules\ImageOrPath;

class ExtracurricularRequest extends ContentRequest
{
    public function rules(): array
    {
        return [
            'name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:50'],
            'cover_image' => ['nullable', new ImageOrPath],
            'summary' => ['nullable', 'string', 'max:1000'],
            'schedule' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'members' => ['nullable', 'string', 'max:100'],
            'about_title' => ['nullable', 'string', 'max:255'],
            'about' => ['nullable', 'string'],
            'gallery_title' => ['nullable', 'string', 'max:255'],
            'gallery' => ['nullable', 'array', 'max:20'],
            'gallery.*' => ['nullable', new ImageOrPath],
            'achievements' => ['nullable', 'array', 'max:30'],
            'achievements.*' => ['nullable'],
            'testimonials' => ['nullable', 'array', 'max:10'],
            'testimonials.*.quote' => ['nullable', 'string', 'max:1000'],
            'testimonials.*.author' => ['nullable', 'string', 'max:255'],
            'is_published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nama ekstrakurikuler',
            'cover_image' => 'foto sampul',
            'gallery.*' => 'foto dokumentasi',
        ];
    }
}
