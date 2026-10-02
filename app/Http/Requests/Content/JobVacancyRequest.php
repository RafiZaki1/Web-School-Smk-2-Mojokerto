<?php

namespace App\Http\Requests\Content;

use App\Models\JobVacancy;
use App\Rules\ImageOrPath;
use Illuminate\Validation\Rule;

class JobVacancyRequest extends ContentRequest
{
    protected array $booleans = [];

    public function rules(): array
    {
        return [
            'title' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'company' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', Rule::in(JobVacancy::CATEGORIES)],
            'employment_type' => ['nullable', Rule::in(JobVacancy::TYPES)],
            'closes_at' => ['nullable', 'date'],
            'status' => ['nullable', Rule::in([JobVacancy::STATUS_OPEN, JobVacancy::STATUS_CLOSED])],
            'poster' => ['nullable', new ImageOrPath],
            'banner_color' => ['nullable', 'string', 'max:20'],
            'banner_headline' => ['nullable', 'string', 'max:255'],
            'banner_subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'responsibilities' => ['nullable', 'array', 'max:30'],
            'responsibilities.*' => ['nullable', 'string', 'max:500'],
            'qualifications' => ['nullable', 'array', 'max:30'],
            'qualifications.*' => ['nullable', 'string', 'max:500'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email', 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'judul posisi',
            'company' => 'nama perusahaan',
            'closes_at' => 'tanggal tutup',
            'contact_email' => 'email pelamar',
        ];
    }
}
