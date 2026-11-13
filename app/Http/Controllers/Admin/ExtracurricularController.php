<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\ExtracurricularServiceInterface;
use App\Http\Requests\ExtracurricularRequest;
use App\Http\Resources\ExtracurricularResource;
use Illuminate\Http\JsonResponse;

class ExtracurricularController extends AdminContentController
{
    /** @var class-string */
    protected string $resource = ExtracurricularResource::class;

    protected string $label = 'Ekstrakurikuler';

    /**
     * Inisialisasi ExtracurricularController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(ExtracurricularServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Simpan ekstrakurikuler baru.
     */
    public function store(ExtracurricularRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui ekstrakurikuler.
     */
    public function update(ExtracurricularRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
