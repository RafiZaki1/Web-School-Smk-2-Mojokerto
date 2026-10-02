<?php

namespace App\Http\Controllers\Api\Admin;

use App\Contracts\Interfaces\AchievementServiceInterface;
use App\Http\Requests\Content\AchievementRequest;
use App\Http\Resources\AchievementResource;
use Illuminate\Http\JsonResponse;

class AchievementController extends AdminContentController
{
    protected string $resource = AchievementResource::class;

    protected string $label = 'Prestasi';

    public function __construct(AchievementServiceInterface $service)
    {
        $this->service = $service;
    }

    public function store(AchievementRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    public function update(AchievementRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
