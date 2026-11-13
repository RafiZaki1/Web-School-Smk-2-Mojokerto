<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\GuestMessageServiceInterface;
use App\Http\Requests\UpdateGuestMessageRequest;
use App\Http\Resources\GuestMessageResource;
use Illuminate\Http\JsonResponse;

class GuestMessageController extends AdminRecordController
{
    /** @var class-string */
    protected string $resource = GuestMessageResource::class;

    protected string $label = 'Pesan buku tamu';

    /** @var array<int, string> */
    protected array $filters = ['status', 'search'];

    /**
     * Inisialisasi GuestMessageController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GuestMessageServiceInterface  $service
     */
    public function __construct(GuestMessageServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Perbarui status atau catatan pesan buku tamu.
     *
     * @param  UpdateGuestMessageRequest  $request
     * @param  string  $id
     * @return JsonResponse
     */
    public function update(UpdateGuestMessageRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
