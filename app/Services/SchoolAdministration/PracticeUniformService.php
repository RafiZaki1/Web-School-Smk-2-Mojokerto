<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\PracticeUniformRepositoryInterface;
use App\Contracts\Interfaces\PracticeUniformServiceInterface;
use App\Enums\UploadDirectoryEnum;

class PracticeUniformService extends RecordService implements PracticeUniformServiceInterface
{
    /** @var array<string, string> */
    protected array $fileFields = ['image' => UploadDirectoryEnum::UNIFORMS->value];

    /**
     * Inisialisasi PracticeUniformService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  PracticeUniformRepositoryInterface  $repository
     * @param  FileUploadServiceInterface  $files
     */
    public function __construct(PracticeUniformRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }
}
