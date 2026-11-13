<?php

namespace App\Rules;

use App\Helpers\AcademicYearHelper;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Tahun ajaran berformat "YYYY/YYYY" dengan tahun berurutan, mis. "2026/2027".
 */
class TahunAjaranRule implements ValidationRule
{
    /**
     * Jalankan validasi.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  Closure  $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! AcademicYearHelper::isValid(is_string($value) ? $value : null)) {
            $fail('Tahun ajaran harus berformat 2026/2027.');
        }
    }
}
