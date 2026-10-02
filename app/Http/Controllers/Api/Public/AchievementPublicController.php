<?php

namespace App\Http\Controllers\Api\Public;

use App\Contracts\Interfaces\AchievementServiceInterface;
use App\Http\Resources\AchievementResource;

class AchievementPublicController extends PublicContentController
{
    protected string $resource = AchievementResource::class;

    protected string $label = 'Prestasi';

    public function __construct(AchievementServiceInterface $service)
    {
        $this->service = $service;
    }
}
