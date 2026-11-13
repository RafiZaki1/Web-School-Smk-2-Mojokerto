<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\DocumentServiceInterface;
use App\Http\Requests\DocumentRequest;
use App\Http\Resources\DocumentResource;
use Illuminate\Http\JsonResponse;

class DocumentController extends AdminContentController
{
    /** @var class-string */
    protected string $resource = DocumentResource::class;

    protected string $label = 'Berkas unduhan';

    /**
     * Inisialisasi DocumentController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(DocumentServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Simpan berkas unduhan baru.
     */
    public function store(DocumentRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui berkas unduhan.
     */
    public function update(DocumentRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
