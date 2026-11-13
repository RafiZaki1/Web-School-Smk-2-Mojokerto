<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\InternshipDocumentationServiceInterface;
use App\Http\Resources\InternshipDocumentationResource;

class InternshipDocumentationPublicController extends PublicRecordController
{
    /** @var class-string */
    protected string $resource = InternshipDocumentationResource::class;

    protected string $label = 'Dokumentasi PKL';

    /** @var array<int, string> */
    protected array $filters = ['major'];

    /**
     * Inisialisasi InternshipDocumentationPublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  InternshipDocumentationServiceInterface  $service
     */
    public function __construct(InternshipDocumentationServiceInterface $service)
    {
        $this->service = $service;
    }
}
