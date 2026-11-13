<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\MajorServiceInterface;
use App\Http\Resources\MajorResource;

class MajorPublicController extends PublicContentController
{
    /** @var class-string */
    protected string $resource = MajorResource::class;

    protected string $label = 'Jurusan';

    /**
     * Inisialisasi MajorPublicController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(MajorServiceInterface $service)
    {
        $this->service = $service;
    }
}
