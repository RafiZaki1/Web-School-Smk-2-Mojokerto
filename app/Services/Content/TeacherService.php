<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\TeacherRepositoryInterface;
use App\Contracts\Interfaces\TeacherServiceInterface;
use App\Enums\UploadDirectoryEnum;

class TeacherService extends ContentService implements TeacherServiceInterface
{
    protected string $slugSource = 'name';

    /** @var array<string, string> */
    protected array $fileFields = ['photo' => UploadDirectoryEnum::TEACHERS->value];

    /**
     * Inisialisasi TeacherService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(TeacherRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }
}
