<?php

namespace App\Http\Requests\Content;

use App\Rules\ImageOrPath;

class MajorRequest extends ContentRequest
{
    public function rules(): array
    {
        return [
            'code' => [$this->requiredOnCreate(), 'string', 'max:30'],
            'name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'accreditation' => ['nullable', 'string', 'max:100'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', new ImageOrPath],
            'accent_color' => ['nullable', 'string', 'max:20'],
            'competencies' => ['nullable', 'array', 'max:20'],
            'competencies.*.icon' => ['nullable', 'string', 'max:50'],
            'competencies.*.title' => ['nullable', 'string', 'max:255'],
            'careers' => ['nullable', 'array', 'max:20'],
            'careers.*.icon' => ['nullable', 'string', 'max:50'],
            'careers.*.title' => ['nullable', 'string', 'max:255'],
            'careers.*.description' => ['nullable', 'string', 'max:500'],
            'facility_title' => ['nullable', 'string', 'max:255'],
            'facilities' => ['nullable', 'array', 'max:30'],
            'facilities.*.title' => ['nullable', 'string', 'max:255'],
            'facilities.*.image' => ['nullable', new ImageOrPath],
            'partners' => ['nullable', 'array', 'max:30'],
            'partners.*.name' => ['nullable', 'string', 'max:255'],
            'partners.*.logo' => ['nullable', new ImageOrPath(2048)],
            'lab_room_slug' => ['nullable', 'string', 'max:255'],
            'is_published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'code' => 'kode jurusan',
            'name' => 'nama jurusan',
            'image' => 'foto jurusan',
            'facilities.*.image' => 'foto fasilitas',
            'partners.*.logo' => 'logo mitra',
        ];
    }
}
