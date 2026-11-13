<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\InternshipDocumentationServiceInterface;
use App\Http\Requests\InternshipDocumentationRequest;
use App\Http\Resources\InternshipDocumentationResource;
use Illuminate\Http\JsonResponse;

class InternshipDocumentationController extends AdminRecordController
{
    /** @var class-string */
    protected string $resource = InternshipDocumentationResource::class;

    protected string $label = 'Dokumentasi PKL';

    /** @var array<int, string> */
    protected array $filters = ['major'];

    /**
     * Inisialisasi InternshipDocumentationController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  InternshipDocumentationServiceInterface  $service
     */
    public function __construct(InternshipDocumentationServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Simpan foto dokumentasi PKL baru.
     *
     * @param  InternshipDocumentationRequest  $request
     * @return JsonResponse
     */
    public function store(InternshipDocumentationRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui foto dokumentasi PKL.
     *
     * @param  InternshipDocumentationRequest  $request
     * @param  string  $id
     * @return JsonResponse
     */
    public function update(InternshipDocumentationRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
