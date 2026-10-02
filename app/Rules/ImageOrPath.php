<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

/**
 * Field gambar dari form admin: berkas baru (gambar/PDF bila diizinkan)
 * atau path/URL lama yang dikirim balik agar tidak diganti.
 */
class ImageOrPath implements ValidationRule
{
    /**
     * @param  array<int, string>  $extensions
     */
    public function __construct(
        protected int $maxKilobytes = 5120,
        protected array $extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
    ) {}

    public static function document(): self
    {
        return new self(5120, ['pdf', 'jpg', 'jpeg', 'png', 'webp']);
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if ($value instanceof UploadedFile) {
            if (! $value->isValid()) {
                $fail('Berkas :attribute gagal diunggah.');

                return;
            }

            if (! in_array(strtolower($value->getClientOriginalExtension()), $this->extensions, true)) {
                $fail('Berkas :attribute harus berformat '.implode(', ', $this->extensions).'.');

                return;
            }

            if ($value->getSize() > $this->maxKilobytes * 1024) {
                $fail('Ukuran :attribute maksimal '.round($this->maxKilobytes / 1024, 1).' MB.');
            }

            return;
        }

        if (! is_string($value) || mb_strlen($value) > 2048) {
            $fail('Isian :attribute tidak valid.');
        }
    }
}
