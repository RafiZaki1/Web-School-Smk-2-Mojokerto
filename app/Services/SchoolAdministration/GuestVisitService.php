<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\GuestVisitRepositoryInterface;
use App\Contracts\Interfaces\GuestVisitServiceInterface;

class GuestVisitService extends RecordService implements GuestVisitServiceInterface
{
    /**
     * Inisialisasi GuestVisitService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GuestVisitRepositoryInterface  $repository
     * @param  FileUploadServiceInterface  $files
     */
    public function __construct(GuestVisitRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }
}
