<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\PracticeUniformServiceInterface;
use App\Http\Requests\UniformRequest;
use App\Http\Resources\PracticeUniformResource;
use Illuminate\Http\JsonResponse;

class PracticeUniformController extends AdminRecordController
{
    /** @var class-string */
    protected string $resource = PracticeUniformResource::class;

    protected string $label = 'Seragam praktik';

    /**
     * Inisialisasi PracticeUniformController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  PracticeUniformServiceInterface  $service
     */
    public function __construct(PracticeUniformServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Perbarui seragam praktik satu jurusan.
     *
     * @param  UniformRequest  $request
     * @param  string  $id
     * @return JsonResponse
     */
    public function update(UniformRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
