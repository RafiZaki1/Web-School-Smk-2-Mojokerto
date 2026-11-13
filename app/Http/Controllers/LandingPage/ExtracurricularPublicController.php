<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\ExtracurricularServiceInterface;
use App\Http\Resources\ExtracurricularResource;

class ExtracurricularPublicController extends PublicContentController
{
    /** @var class-string */
    protected string $resource = ExtracurricularResource::class;

    protected string $label = 'Ekstrakurikuler';

    /**
     * Inisialisasi ExtracurricularPublicController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(ExtracurricularServiceInterface $service)
    {
        $this->service = $service;
    }
}
