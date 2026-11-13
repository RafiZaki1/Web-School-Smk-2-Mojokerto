<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\TeacherServiceInterface;
use App\Http\Requests\TeacherRequest;
use App\Http\Resources\TeacherResource;
use Illuminate\Http\JsonResponse;

class TeacherController extends AdminContentController
{
    /** @var class-string */
    protected string $resource = TeacherResource::class;

    protected string $label = 'Guru & staf';

    /**
     * Inisialisasi TeacherController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(TeacherServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Simpan guru atau tenaga kependidikan baru.
     */
    public function store(TeacherRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui data guru atau tenaga kependidikan.
     */
    public function update(TeacherRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
