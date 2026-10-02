<?php

namespace App\Http\Requests\Content;

use App\Rules\ImageOrPath;

class AlumniRequest extends ContentRequest
{
    protected array $booleans = ['is_featured'];

    public function rules(): array
    {
        return [
            'name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'major_code' => [$this->requiredOnCreate(), 'string', 'max:30'],
            'graduation_year' => [$this->requiredOnCreate(), 'integer', 'min:1978', 'max:'.(now()->year + 1)],
            'career' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', new ImageOrPath(2048)],
            'is_featured' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
