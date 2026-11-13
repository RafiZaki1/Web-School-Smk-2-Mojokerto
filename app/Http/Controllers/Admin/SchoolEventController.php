<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\SchoolEventServiceInterface;
use App\Http\Requests\SchoolEventRequest;
use App\Http\Resources\SchoolEventResource;
use Illuminate\Http\JsonResponse;

class SchoolEventController extends AdminContentController
{
    /** @var class-string */
    protected string $resource = SchoolEventResource::class;

    protected string $label = 'Agenda';

    /**
     * Inisialisasi SchoolEventController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(SchoolEventServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Simpan agenda baru.
     */
    public function store(SchoolEventRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui agenda.
     */
    public function update(SchoolEventRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
