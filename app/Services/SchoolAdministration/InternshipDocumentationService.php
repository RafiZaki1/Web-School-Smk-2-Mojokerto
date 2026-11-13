<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\InternshipDocumentationRepositoryInterface;
use App\Contracts\Interfaces\InternshipDocumentationServiceInterface;
use App\Enums\UploadDirectoryEnum;

class InternshipDocumentationService extends RecordService implements InternshipDocumentationServiceInterface
{
    /** @var array<string, string> */
    protected array $fileFields = ['image' => UploadDirectoryEnum::INTERNSHIP_DOCUMENTATIONS->value];

    /**
     * Inisialisasi InternshipDocumentationService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  InternshipDocumentationRepositoryInterface  $repository
     * @param  FileUploadServiceInterface  $files
     */
    public function __construct(InternshipDocumentationRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }
}
