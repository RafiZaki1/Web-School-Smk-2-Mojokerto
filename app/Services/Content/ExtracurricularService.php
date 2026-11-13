<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\ExtracurricularRepositoryInterface;
use App\Contracts\Interfaces\ExtracurricularServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Enums\UploadDirectoryEnum;
use Illuminate\Database\Eloquent\Model;

class ExtracurricularService extends ContentService implements ExtracurricularServiceInterface
{
    protected string $slugSource = 'name';

    /** @var array<string, string> */
    protected array $fileFields = ['cover_image' => UploadDirectoryEnum::EXTRACURRICULARS->value];

    /** @var array<string, string> */
    protected array $fileListFields = ['gallery' => UploadDirectoryEnum::EXTRACURRICULAR_GALLERY->value];

    /**
     * Inisialisasi ExtracurricularService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(ExtracurricularRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    /**
     * Rapikan daftar pencapaian dan testimoni. Form admin mengirim teks biasa, sehingga ikon piala dipakai sebagai default.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function transform(array $data, ?Model $model): array
    {
        if (array_key_exists('achievements', $data)) {
            $data['achievements'] = collect($data['achievements'] ?? [])
                ->map(fn ($item) => is_array($item) ? $item : ['icon' => 'trophy', 'text' => (string) $item])
                ->map(fn (array $item) => ['icon' => $item['icon'] ?? 'trophy', 'text' => trim((string) ($item['text'] ?? ''))])
                ->filter(fn (array $item) => $item['text'] !== '')
                ->values()
                ->all();
        }

        if (array_key_exists('testimonials', $data)) {
            $data['testimonials'] = collect($data['testimonials'] ?? [])
                ->filter(fn ($item) => is_array($item) && trim((string) ($item['quote'] ?? '')) !== '')
                ->map(fn (array $item) => [
                    'quote' => trim($item['quote']),
                    'author' => trim((string) ($item['author'] ?? '')) ?: null,
                ])
                ->values()
                ->all();
        }

        return $data;
    }
}
