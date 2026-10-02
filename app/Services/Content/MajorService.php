<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\MajorRepositoryInterface;
use App\Contracts\Interfaces\MajorServiceInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class MajorService extends ContentService implements MajorServiceInterface
{
    protected string $slugSource = 'code';

    protected array $fileFields = ['image' => 'majors'];

    public function __construct(MajorRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    protected function transform(array $data, ?Model $model): array
    {
        if (isset($data['code'])) {
            $data['code'] = strtoupper(trim($data['code']));
        }

        foreach (['competencies', 'careers'] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = collect($data[$field] ?? [])
                    ->filter(fn ($item) => is_array($item) && trim((string) ($item['title'] ?? '')) !== '')
                    ->map(fn (array $item) => array_filter([
                        'icon' => $item['icon'] ?? 'Sparkles',
                        'title' => trim($item['title']),
                        'description' => isset($item['description']) ? trim((string) $item['description']) : null,
                    ], fn ($value) => $value !== null && $value !== ''))
                    ->values()
                    ->all();
            }
        }

        if (array_key_exists('facilities', $data)) {
            $facilities = $this->storeItemFiles($data['facilities'], 'image', 'majors/facilities', $model?->facilities);
            $data['facilities'] = array_values(array_filter($facilities, fn (array $item) => ! empty($item['image'])));
        }

        if (array_key_exists('partners', $data)) {
            // Form admin hanya mengunggah logo; nama mitra diambil dari nama berkas bila kosong
            $partners = collect($data['partners'] ?? [])->map(function ($item) {
                if ($item instanceof UploadedFile || is_string($item)) {
                    $item = ['logo' => $item];
                }
                if (empty($item['name']) && ($item['logo'] ?? null) instanceof UploadedFile) {
                    $item['name'] = pathinfo($item['logo']->getClientOriginalName(), PATHINFO_FILENAME);
                }

                return $item;
            })->all();

            $partners = $this->storeItemFiles($partners, 'logo', 'majors/partners', $model?->partners);
            $data['partners'] = array_values(array_filter($partners, fn (array $item) => ! empty($item['logo'])));
        }

        return $data;
    }

    protected function mediaPaths(Model $model): array
    {
        return array_merge(
            parent::mediaPaths($model),
            array_column($model->facilities ?? [], 'image'),
            array_column($model->partners ?? [], 'logo'),
        );
    }
}
