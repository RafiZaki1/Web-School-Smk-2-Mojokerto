<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\JobVacancyRepositoryInterface;
use App\Contracts\Interfaces\JobVacancyServiceInterface;
use App\Enums\UploadDirectoryEnum;
use Illuminate\Database\Eloquent\Model;

class JobVacancyService extends ContentService implements JobVacancyServiceInterface
{
    /** @var array<string, string> */
    protected array $fileFields = ['poster' => UploadDirectoryEnum::JOBS->value];

    /**
     * Inisialisasi JobVacancyService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(JobVacancyRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    /**
     * Buang baris kosong dari daftar tanggung jawab dan kualifikasi.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function transform(array $data, ?Model $model): array
    {
        foreach (['responsibilities', 'qualifications'] as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = $this->cleanList($data[$field]);
            }
        }

        return $data;
    }
}
