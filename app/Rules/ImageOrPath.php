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
     * Peta ekstensi yang diizinkan ke daftar MIME asli yang sah untuknya.
     * Validasi memakai isi berkas (deteksi MIME), bukan ekstensi dari nama
     * berkas yang bisa dipalsukan pengirim.
     *
     * @var array<string, array<int, string>>
     */
    private const MIME_MAP = [
        'jpg' => ['image/jpeg'],
        'jpeg' => ['image/jpeg'],
        'png' => ['image/png'],
        'webp' => ['image/webp'],
        'gif' => ['image/gif'],
        'svg' => ['image/svg+xml', 'text/plain', 'text/xml', 'application/xml'],
        'pdf' => ['application/pdf'],
    ];

    /**
     * @param  array<int, string>  $extensions
     */
    public function __construct(
        protected int $maxKilobytes = 5120,
        protected array $extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
    ) {}

    /**
     * Buat aturan untuk berkas dokumen yang diizinkan, yaitu PDF dan gambar dengan batas 5 MB.
     */
    public static function document(): self
    {
        return new self(5120, ['pdf', 'jpg', 'jpeg', 'png', 'webp']);
    }

    /**
     * Validasi isi field gambar atau path: berkas harus valid, berformat diizinkan, dan tidak melebihi batas ukuran.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if ($value instanceof UploadedFile) {
            $this->validateFile($attribute, $value, $fail);

            return;
        }

        if (! is_string($value) || mb_strlen($value) > 2048) {
            $fail('Isian :attribute tidak valid.');
        }
    }

    /**
     * Pastikan berkas unggahan sah, bertipe sesuai isinya, dan tidak melebihi batas ukuran.
     */
    private function validateFile(string $attribute, UploadedFile $file, Closure $fail): void
    {
        if (! $file->isValid()) {
            $fail('Berkas :attribute gagal diunggah.');

            return;
        }

        if ($file->getSize() > $this->maxKilobytes * 1024) {
            $fail('Ukuran :attribute maksimal '.round($this->maxKilobytes / 1024, 1).' MB.');

            return;
        }

        // Tipe berkas ditentukan dari isinya (magic bytes), bukan dari ekstensi nama
        // berkas yang dikontrol pengirim. Ini mencegah berkas berbahaya diselundupkan
        // dengan nama ".jpg" padahal isinya skrip.
        $mime = (string) $file->getMimeType();
        $allowedMimes = [];
        foreach ($this->extensions as $extension) {
            foreach (self::MIME_MAP[$extension] ?? [] as $allowed) {
                $allowedMimes[$allowed] = true;
            }
        }

        if (! isset($allowedMimes[$mime])) {
            $fail('Berkas :attribute harus berformat '.implode(', ', $this->extensions).'.');

            return;
        }

        // SVG berisi XML yang bisa membawa skrip (stored XSS). Tolak bila ada tanda
        // elemen aktif atau penanganan event di dalamnya.
        if (in_array('svg', $this->extensions, true) && $this->isDangerousSvg($file, $mime)) {
            $fail('Berkas :attribute mengandung skrip yang tidak diizinkan.');
        }
    }

    /**
     * Deteksi SVG yang memuat skrip atau event handler aktif.
     */
    private function isDangerousSvg(UploadedFile $file, string $mime): bool
    {
        if ($mime === 'image/png' || $mime === 'image/jpeg' || $mime === 'image/webp' || $mime === 'image/gif') {
            return false;
        }

        $contents = (string) file_get_contents($file->getRealPath());

        if ($contents === '') {
            return false;
        }

        return (bool) preg_match('/<script|javascript:|on\w+\s*=|<!ENTITY|<foreignObject/i', $contents);
    }
}
