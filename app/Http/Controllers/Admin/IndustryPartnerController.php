<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\IndustryPartnerServiceInterface;
use App\Http\Requests\IndustryPartnerRequest;
use App\Http\Resources\IndustryPartnerResource;
use Illuminate\Http\JsonResponse;

class IndustryPartnerController extends AdminRecordController
{
    /** @var class-string */
    protected string $resource = IndustryPartnerResource::class;

    protected string $label = 'Mitra DU/DI';

    /** @var array<int, string> */
    protected array $filters = ['major', 'search'];

    /**
     * Inisialisasi IndustryPartnerController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  IndustryPartnerServiceInterface  $service
     */
    public function __construct(IndustryPartnerServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Simpan mitra DU/DI baru.
     *
     * @param  IndustryPartnerRequest  $request
     * @return JsonResponse
     */
    public function store(IndustryPartnerRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui data mitra DU/DI.
     *
     * @param  IndustryPartnerRequest  $request
     * @param  string  $id
     * @return JsonResponse
     */
    public function update(IndustryPartnerRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
