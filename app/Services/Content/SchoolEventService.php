<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\SchoolEventRepositoryInterface;
use App\Contracts\Interfaces\SchoolEventServiceInterface;
use App\Enums\UploadDirectoryEnum;
use Illuminate\Database\Eloquent\Model;

class SchoolEventService extends ContentService implements SchoolEventServiceInterface
{
    /** @var array<string, string> */
    protected array $fileFields = ['cover_image' => UploadDirectoryEnum::EVENTS->value];

    /**
     * Inisialisasi SchoolEventService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(SchoolEventRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    /**
     * Anggap agenda satu hari bila tanggal selesai kosong, sama dengan, atau sebelum tanggal mulai.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function transform(array $data, ?Model $model): array
    {
        $start = $data['starts_on'] ?? $model?->starts_on?->toDateString();

        if (array_key_exists('ends_on', $data) && (! $data['ends_on'] || ($start && $data['ends_on'] <= $start))) {
            $data['ends_on'] = null;
        }

        return $data;
    }
}
