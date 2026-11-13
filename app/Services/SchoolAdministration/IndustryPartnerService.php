<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\IndustryPartnerRepositoryInterface;
use App\Contracts\Interfaces\IndustryPartnerServiceInterface;
use App\Enums\UploadDirectoryEnum;
use Illuminate\Database\Eloquent\Model;

class IndustryPartnerService extends RecordService implements IndustryPartnerServiceInterface
{
    /** @var array<string, string> */
    protected array $fileFields = ['logo' => UploadDirectoryEnum::INDUSTRY_PARTNERS->value];

    /**
     * Inisialisasi IndustryPartnerService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  IndustryPartnerRepositoryInterface  $repository
     * @param  FileUploadServiceInterface  $files
     */
    public function __construct(IndustryPartnerRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    /**
     * Rapikan daftar kode jurusan agar unik dan tersimpan sebagai array.
     *
     * @param  array<string, mixed>  $data
     * @param  ?Model  $model
     * @return array<string, mixed>
     */
    protected function transform(array $data, ?Model $model): array
    {
        if (array_key_exists('major_codes', $data)) {
            $data['major_codes'] = array_values(array_unique(array_filter((array) ($data['major_codes'] ?? []))));
        }

        return $data;
    }
}
