<?php

namespace App\Http\Requests\Content;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Dasar request konten admin. Form dikirim sebagai multipart/form-data,
 * jadi nilai boolean datang sebagai string ("true"/"false"/"1"/"0").
 */
abstract class ContentRequest extends FormRequest
{
    /** @var array<int, string> */
    protected array $booleans = ['is_published'];

    public function authorize(): bool
    {
        return true;
    }

    protected function isUpdate(): bool
    {
        return in_array($this->method(), ['PUT', 'PATCH'], true) || $this->route()?->parameter('id') !== null;
    }

    /** "required" saat membuat, "sometimes" saat memperbarui sebagian. */
    protected function requiredOnCreate(): string
    {
        return $this->isUpdate() ? 'sometimes' : 'required';
    }

    protected function prepareForValidation(): void
    {
        $normalized = [];
        foreach ($this->booleans as $key) {
            if ($this->has($key)) {
                $normalized[$key] = filter_var($this->input($key), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            }
        }

        if ($normalized) {
            $this->merge($normalized);
        }
    }
}
