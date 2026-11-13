<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\UniformScheduleServiceInterface;
use App\Http\Requests\UniformRequest;
use App\Http\Resources\UniformScheduleResource;
use Illuminate\Http\JsonResponse;

class UniformScheduleController extends AdminRecordController
{
    /** @var class-string */
    protected string $resource = UniformScheduleResource::class;

    protected string $label = 'Jadwal seragam';

    /**
     * Inisialisasi UniformScheduleController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  UniformScheduleServiceInterface  $service
     */
    public function __construct(UniformScheduleServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Perbarui seragam pada satu hari sekolah.
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
