<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\AchievementServiceInterface;
use App\Http\Requests\AchievementRequest;
use App\Http\Resources\AchievementResource;
use Illuminate\Http\JsonResponse;

class AchievementController extends AdminContentController
{
    /** @var class-string */
    protected string $resource = AchievementResource::class;

    protected string $label = 'Prestasi';

    /**
     * Inisialisasi AchievementController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(AchievementServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Simpan prestasi baru.
     */
    public function store(AchievementRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui prestasi.
     */
    public function update(AchievementRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
