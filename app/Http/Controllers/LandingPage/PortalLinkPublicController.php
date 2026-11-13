<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\PortalLinkServiceInterface;
use App\Http\Resources\PortalLinkResource;

class PortalLinkPublicController extends PublicRecordController
{
    /** @var class-string */
    protected string $resource = PortalLinkResource::class;

    protected string $label = 'Pintasan portal';

    /**
     * Inisialisasi PortalLinkPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  PortalLinkServiceInterface  $service
     */
    public function __construct(PortalLinkServiceInterface $service)
    {
        $this->service = $service;
    }
}
