<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\ExtracurricularRepositoryInterface;
use App\Contracts\Interfaces\ExtracurricularServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use Illuminate\Database\Eloquent\Model;

class ExtracurricularService extends ContentService implements ExtracurricularServiceInterface
{
    protected string $slugSource = 'name';

    protected array $fileFields = ['cover_image' => 'extracurriculars'];

    protected array $fileListFields = ['gallery' => 'extracurriculars/gallery'];

    public function __construct(ExtracurricularRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    protected function transform(array $data, ?Model $model): array
    {
        if (array_key_exists('achievements', $data)) {
            // Form admin mengirim teks biasa; ikon piala dipakai sebagai default
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
