<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\JobVacancyRepositoryInterface;
use App\Contracts\Interfaces\JobVacancyServiceInterface;
use Illuminate\Database\Eloquent\Model;

class JobVacancyService extends ContentService implements JobVacancyServiceInterface
{
    protected array $fileFields = ['poster' => 'jobs'];

    public function __construct(JobVacancyRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

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
