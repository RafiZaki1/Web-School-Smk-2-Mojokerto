<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\PortalLinkServiceInterface;
use App\Http\Requests\PortalLinkRequest;
use App\Http\Resources\PortalLinkResource;
use Illuminate\Http\JsonResponse;

class PortalLinkController extends AdminRecordController
{
    /** @var class-string */
    protected string $resource = PortalLinkResource::class;

    protected string $label = 'Pintasan portal';

    /**
     * Inisialisasi PortalLinkController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  PortalLinkServiceInterface  $service
     */
    public function __construct(PortalLinkServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Perbarui label atau alamat pintasan portal.
     *
     * @param  PortalLinkRequest  $request
     * @param  string  $id
     * @return JsonResponse
     */
    public function update(PortalLinkRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
