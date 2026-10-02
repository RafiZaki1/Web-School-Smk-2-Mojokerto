<?php

namespace App\Providers;

use App\Contracts\Interfaces\AchievementRepositoryInterface;
use App\Contracts\Interfaces\AchievementServiceInterface;
use App\Contracts\Interfaces\AlumniRepositoryInterface;
use App\Contracts\Interfaces\AlumniServiceInterface;
use App\Contracts\Interfaces\ArticleRepositoryInterface;
use App\Contracts\Interfaces\ArticleServiceInterface;
use App\Contracts\Interfaces\AspirationRepositoryInterface;
use App\Contracts\Interfaces\AspirationServiceInterface;
use App\Contracts\Interfaces\AuthServiceInterface;
use App\Contracts\Interfaces\ChatbotServiceInterface;
use App\Contracts\Interfaces\DashboardServiceInterface;
use App\Contracts\Interfaces\ExtracurricularRepositoryInterface;
use App\Contracts\Interfaces\ExtracurricularServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\GalleryRepositoryInterface;
use App\Contracts\Interfaces\GalleryServiceInterface;
use App\Contracts\Interfaces\HeroRepositoryInterface;
use App\Contracts\Interfaces\HeroServiceInterface;
use App\Contracts\Interfaces\HomeServiceInterface;
use App\Contracts\Interfaces\JobVacancyRepositoryInterface;
use App\Contracts\Interfaces\JobVacancyServiceInterface;
use App\Contracts\Interfaces\MajorRepositoryInterface;
use App\Contracts\Interfaces\MajorServiceInterface;
use App\Contracts\Interfaces\MapRepositoryInterface;
use App\Contracts\Interfaces\MapRoutingServiceInterface;
use App\Contracts\Interfaces\MapServiceInterface;
use App\Contracts\Interfaces\RoomCategoryRepositoryInterface;
use App\Contracts\Interfaces\RoomCategoryServiceInterface;
use App\Contracts\Interfaces\RoomRepositoryInterface;
use App\Contracts\Interfaces\RoomServiceInterface;
use App\Contracts\Interfaces\SchoolProfileRepositoryInterface;
use App\Contracts\Interfaces\SchoolProfileServiceInterface;
use App\Contracts\Interfaces\SiteContentRepositoryInterface;
use App\Contracts\Interfaces\SiteContentServiceInterface;
use App\Contracts\Interfaces\StatisticRepositoryInterface;
use App\Contracts\Interfaces\StatisticServiceInterface;
use App\Contracts\Repositories\AchievementRepository;
use App\Contracts\Repositories\AlumniRepository;
use App\Contracts\Repositories\ArticleRepository;
use App\Contracts\Repositories\AspirationRepository;
use App\Contracts\Repositories\ExtracurricularRepository;
use App\Contracts\Repositories\GalleryRepository;
use App\Contracts\Repositories\HeroRepository;
use App\Contracts\Repositories\JobVacancyRepository;
use App\Contracts\Repositories\MajorRepository;
use App\Contracts\Repositories\MapRepository;
use App\Contracts\Repositories\RoomCategoryRepository;
use App\Contracts\Repositories\RoomRepository;
use App\Contracts\Repositories\SchoolProfileRepository;
use App\Contracts\Repositories\SiteContentRepository;
use App\Contracts\Repositories\StatisticRepository;
use App\Services\Auth\AuthService;
use App\Services\Content\AchievementService;
use App\Services\Content\AlumniService;
use App\Services\Content\ArticleService;
use App\Services\Content\AspirationService;
use App\Services\Content\DashboardService;
use App\Services\Content\ExtracurricularService;
use App\Services\Content\JobVacancyService;
use App\Services\Content\MajorService;
use App\Services\Content\SiteContentService;
use App\Services\LandingPage\ChatbotService;
use App\Services\LandingPage\FileUploadService;
use App\Services\LandingPage\GalleryService;
use App\Services\LandingPage\HeroService;
use App\Services\LandingPage\HomeService;
use App\Services\LandingPage\MapRoutingService;
use App\Services\LandingPage\MapService;
use App\Services\LandingPage\RoomCategoryService;
use App\Services\LandingPage\RoomService;
use App\Services\LandingPage\SchoolProfileService;
use App\Services\LandingPage\StatisticService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    private array $register = [
        HeroRepositoryInterface::class => HeroRepository::class,
        GalleryRepositoryInterface::class => GalleryRepository::class,
        RoomRepositoryInterface::class => RoomRepository::class,
        RoomCategoryRepositoryInterface::class => RoomCategoryRepository::class,
        MapRepositoryInterface::class => MapRepository::class,
        SchoolProfileRepositoryInterface::class => SchoolProfileRepository::class,
        StatisticRepositoryInterface::class => StatisticRepository::class,
        MajorRepositoryInterface::class => MajorRepository::class,
        AchievementRepositoryInterface::class => AchievementRepository::class,
        ExtracurricularRepositoryInterface::class => ExtracurricularRepository::class,
        ArticleRepositoryInterface::class => ArticleRepository::class,
        JobVacancyRepositoryInterface::class => JobVacancyRepository::class,
        AlumniRepositoryInterface::class => AlumniRepository::class,
        AspirationRepositoryInterface::class => AspirationRepository::class,
        SiteContentRepositoryInterface::class => SiteContentRepository::class,

        HeroServiceInterface::class => HeroService::class,
        GalleryServiceInterface::class => GalleryService::class,
        HomeServiceInterface::class => HomeService::class,
        RoomServiceInterface::class => RoomService::class,
        RoomCategoryServiceInterface::class => RoomCategoryService::class,
        MapServiceInterface::class => MapService::class,
        MapRoutingServiceInterface::class => MapRoutingService::class,
        SchoolProfileServiceInterface::class => SchoolProfileService::class,
        StatisticServiceInterface::class => StatisticService::class,
        ChatbotServiceInterface::class => ChatbotService::class,
        MajorServiceInterface::class => MajorService::class,
        AchievementServiceInterface::class => AchievementService::class,
        ExtracurricularServiceInterface::class => ExtracurricularService::class,
        ArticleServiceInterface::class => ArticleService::class,
        JobVacancyServiceInterface::class => JobVacancyService::class,
        AlumniServiceInterface::class => AlumniService::class,
        AspirationServiceInterface::class => AspirationService::class,
        SiteContentServiceInterface::class => SiteContentService::class,
        DashboardServiceInterface::class => DashboardService::class,
        AuthServiceInterface::class => AuthService::class,

        FileUploadServiceInterface::class => FileUploadService::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        foreach ($this->register as $index => $value) {
            $this->app->bind($index, $value);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
