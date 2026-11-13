<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\SchoolRuleRepositoryInterface;
use App\Contracts\Interfaces\SchoolRuleServiceInterface;

class SchoolRuleService extends RecordService implements SchoolRuleServiceInterface
{
    /**
     * Inisialisasi SchoolRuleService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SchoolRuleRepositoryInterface  $repository
     * @param  FileUploadServiceInterface  $files
     */
    public function __construct(SchoolRuleRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }
}
