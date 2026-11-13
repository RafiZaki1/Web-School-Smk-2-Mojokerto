<?php

namespace App\Http\Requests;

/**
 * Dasar request konten admin. Form dikirim sebagai multipart/form-data,
 * jadi nilai boolean datang sebagai string ("true"/"false"/"1"/"0").
 */
abstract class ContentRequest extends ApiRequest
{
    /** @var array<int, string> */
    protected array $booleans = ['is_published'];

    /**
     * Tentukan apakah request ini merupakan perubahan data yang sudah ada.
     */
    protected function isUpdate(): bool
    {
        return in_array($this->method(), ['PUT', 'PATCH'], true) || $this->route()?->parameter('id') !== null;
    }

    /**
     * Wajibkan kolom saat membuat data, dan cukup ada bila hanya memperbarui sebagian.
     */
    protected function requiredOnCreate(): string
    {
        return $this->isUpdate() ? 'sometimes' : 'required';
    }

    /**
     * Ubah nilai boolean dari form-data menjadi boolean sebelum validasi.
     */
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

    /**
     * Pesan error kustom dasar untuk aturan validasi konten.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'is_published.boolean' => 'Status publikasi harus berupa nilai boolean.',
        ];
    }
}
