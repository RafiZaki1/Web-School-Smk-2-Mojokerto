<?php

namespace App\Http\Requests\Content;

use App\Rules\ImageOrPath;
use Illuminate\Validation\Rule;

class AchievementRequest extends ContentRequest
{
    public const RANKS = ['Juara 1', 'Juara 2', 'Juara 3', 'Medali', 'Harapan'];

    public const LEVELS = ['Lokal', 'Regional', 'Provinsi', 'Nasional', 'Internasional'];

    public const CATEGORIES = ['Akademik', 'Non-akademik', 'Olahraga', 'Seni'];

    public function rules(): array
    {
        return [
            'title' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'card_title' => ['nullable', 'string', 'max:255'],
            'rank' => [$this->requiredOnCreate(), 'string', 'max:50'],
            'level' => [$this->requiredOnCreate(), Rule::in(self::LEVELS)],
            'category' => ['nullable', Rule::in(self::CATEGORIES)],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'student_name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'student_class' => ['nullable', 'string', 'max:100'],
            'student_photo' => ['nullable', new ImageOrPath(2048)],
            'cover_image' => ['nullable', new ImageOrPath],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'location' => ['nullable', 'string', 'max:255'],
            'organizer' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'document' => ['nullable', ImageOrPath::document()],
            'testimonial' => ['nullable', 'array'],
            'testimonial.quote' => ['nullable', 'string', 'max:1000'],
            'testimonial.name' => ['nullable', 'string', 'max:255'],
            'testimonial.position' => ['nullable', 'string', 'max:255'],
            'gallery_title' => ['nullable', 'string', 'max:255'],
            'gallery_description' => ['nullable', 'string', 'max:1000'],
            'gallery' => ['nullable', 'array', 'max:20'],
            'gallery.*' => ['nullable', new ImageOrPath],
            'is_published' => ['nullable', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'judul prestasi',
            'rank' => 'predikat',
            'level' => 'tingkat',
            'student_name' => 'nama siswa',
            'end_date' => 'tanggal selesai',
            'gallery.*' => 'foto galeri',
        ];
    }
}
