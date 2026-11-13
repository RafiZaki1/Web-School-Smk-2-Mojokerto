<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\MajorServiceInterface;
use App\Http\Requests\MajorRequest;
use App\Http\Resources\MajorResource;
use Illuminate\Http\JsonResponse;

class MajorController extends AdminContentController
{
    /** @var class-string */
    protected string $resource = MajorResource::class;

    protected string $label = 'Jurusan';

    /**
     * Inisialisasi MajorController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(MajorServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Simpan jurusan baru.
     */
    public function store(MajorRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui jurusan.
     */
    public function update(MajorRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
