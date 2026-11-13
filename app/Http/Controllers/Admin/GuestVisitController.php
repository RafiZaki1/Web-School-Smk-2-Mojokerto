<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\GuestVisitServiceInterface;
use App\Http\Requests\GuestVisitRequest;
use App\Http\Resources\GuestVisitResource;
use Illuminate\Http\JsonResponse;

class GuestVisitController extends AdminRecordController
{
    /** @var class-string */
    protected string $resource = GuestVisitResource::class;

    protected string $label = 'Jadwal kunjungan';

    /** @var array<int, string> */
    protected array $filters = ['status', 'when'];

    /**
     * Inisialisasi GuestVisitController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GuestVisitServiceInterface  $service
     */
    public function __construct(GuestVisitServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Catat jadwal kunjungan tamu instansi.
     *
     * @param  GuestVisitRequest  $request
     * @return JsonResponse
     */
    public function store(GuestVisitRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui jadwal kunjungan tamu instansi.
     *
     * @param  GuestVisitRequest  $request
     * @param  string  $id
     * @return JsonResponse
     */
    public function update(GuestVisitRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
