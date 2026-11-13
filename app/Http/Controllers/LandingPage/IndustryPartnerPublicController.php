<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\IndustryPartnerServiceInterface;
use App\Http\Resources\IndustryPartnerResource;

class IndustryPartnerPublicController extends PublicRecordController
{
    /** @var class-string */
    protected string $resource = IndustryPartnerResource::class;

    protected string $label = 'Mitra DU/DI';

    /** @var array<int, string> */
    protected array $filters = ['major'];

    /**
     * Inisialisasi IndustryPartnerPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  IndustryPartnerServiceInterface  $service
     */
    public function __construct(IndustryPartnerServiceInterface $service)
    {
        $this->service = $service;
    }
}
