<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\MajorRepositoryInterface;
use App\Contracts\Interfaces\MajorServiceInterface;
use App\Enums\UploadDirectoryEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class MajorService extends ContentService implements MajorServiceInterface
{
    protected string $slugSource = 'code';

    /** @var array<string, string> */
    protected array $fileFields = ['image' => UploadDirectoryEnum::MAJORS->value];

    /**
     * Inisialisasi MajorService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(MajorRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    /**
     * Rapikan kode jurusan, kompetensi, prospek karier, fasilitas, dan mitra.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function transform(array $data, ?Model $model): array
    {
        if (isset($data['code'])) {
            $data['code'] = strtoupper(trim($data['code']));
        }

        foreach (['competencies', 'careers'] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = $this->normalizeSpecs($data[$field]);
            }
        }

        if (array_key_exists('facilities', $data)) {
            $data['facilities'] = $this->storeFacilities($data['facilities'], $model);
        }

        if (array_key_exists('partners', $data)) {
            $data['partners'] = $this->storePartners($data['partners'], $model);
        }

        return $data;
    }

    /**
     * Buang kompetensi atau prospek karier tanpa judul dan isi ikon serta teks yang kosong.
     *
     * @param  array<int, mixed>|null  $items
     * @return array<int, array<string, mixed>>
     */
    private function normalizeSpecs(?array $items): array
    {
        return collect($items ?? [])
            ->filter(fn ($item) => is_array($item) && trim((string) ($item['title'] ?? '')) !== '')
            ->map(fn (array $item) => array_filter([
                'icon' => $item['icon'] ?? 'Sparkles',
                'title' => trim($item['title']),
                'description' => isset($item['description']) ? trim((string) $item['description']) : null,
            ], fn ($value) => $value !== null && $value !== ''))
            ->values()
            ->all();
    }

    /**
     * Simpan foto fasilitas dan buang fasilitas yang tidak memiliki foto.
     *
     * @param  array<int, mixed>|null  $facilities
     * @return array<int, array<string, mixed>>
     */
    private function storeFacilities(?array $facilities, ?Model $model): array
    {
        $stored = $this->storeItemFiles($facilities, 'image', UploadDirectoryEnum::MAJOR_FACILITIES->value, $model?->facilities);

        return array_values(array_filter($stored, fn (array $item) => ! empty($item['image'])));
    }

    /**
     * Simpan logo mitra dan isi nama dari nama berkas bila nama kosong.
     *
     * @param  array<int, mixed>|null  $partners
     * @return array<int, array<string, mixed>>
     */
    private function storePartners(?array $partners, ?Model $model): array
    {
        $items = collect($partners ?? [])->map(function ($item) {
            if ($item instanceof UploadedFile || is_string($item)) {
                $item = ['logo' => $item];
            }

            if (empty($item['name']) && ($item['logo'] ?? null) instanceof UploadedFile) {
                $item['name'] = pathinfo($item['logo']->getClientOriginalName(), PATHINFO_FILENAME);
            }

            return $item;
        })->all();

        $stored = $this->storeItemFiles($items, 'logo', UploadDirectoryEnum::MAJOR_PARTNERS->value, $model?->partners);

        return array_values(array_filter($stored, fn (array $item) => ! empty($item['logo'])));
    }

    /**
     * Ambil seluruh path berkas milik jurusan, termasuk foto fasilitas dan logo mitra.
     *
     * @return array<int, mixed>
     */
    protected function mediaPaths(Model $model): array
    {
        return array_merge(
            parent::mediaPaths($model),
            array_column($model->facilities ?? [], 'image'),
            array_column($model->partners ?? [], 'logo'),
        );
    }
}
