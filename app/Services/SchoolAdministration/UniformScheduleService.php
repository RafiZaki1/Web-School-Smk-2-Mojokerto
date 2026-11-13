<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\UniformScheduleRepositoryInterface;
use App\Contracts\Interfaces\UniformScheduleServiceInterface;
use App\Enums\UploadDirectoryEnum;

class UniformScheduleService extends RecordService implements UniformScheduleServiceInterface
{
    /** @var array<string, string> */
    protected array $fileFields = ['image' => UploadDirectoryEnum::UNIFORMS->value];

    /**
     * Inisialisasi UniformScheduleService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  UniformScheduleRepositoryInterface  $repository
     * @param  FileUploadServiceInterface  $files
     */
    public function __construct(UniformScheduleRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }
}
