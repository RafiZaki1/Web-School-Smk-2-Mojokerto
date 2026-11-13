<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\AchievementServiceInterface;
use App\Http\Resources\AchievementResource;

class AchievementPublicController extends PublicContentController
{
    /** @var class-string */
    protected string $resource = AchievementResource::class;

    protected string $label = 'Prestasi';

    /**
     * Inisialisasi AchievementPublicController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(AchievementServiceInterface $service)
    {
        $this->service = $service;
    }
}
