<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\PortalLinkRepositoryInterface;
use App\Contracts\Interfaces\PortalLinkServiceInterface;

class PortalLinkService extends RecordService implements PortalLinkServiceInterface
{
    /**
     * Inisialisasi PortalLinkService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  PortalLinkRepositoryInterface  $repository
     * @param  FileUploadServiceInterface  $files
     */
    public function __construct(PortalLinkRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }
}
