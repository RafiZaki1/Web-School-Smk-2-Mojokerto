<?php

namespace App\Providers;

use App\Contracts\Interfaces\AchievementRepositoryInterface;
use App\Contracts\Interfaces\AchievementServiceInterface;
use App\Contracts\Interfaces\AlumniRepositoryInterface;
use App\Contracts\Interfaces\AlumniServiceInterface;
use App\Contracts\Interfaces\AlumniServiceRequestRepositoryInterface;
use App\Contracts\Interfaces\AlumniServiceRequestServiceInterface;
use App\Contracts\Interfaces\ArticleRepositoryInterface;
use App\Contracts\Interfaces\ArticleServiceInterface;
use App\Contracts\Interfaces\AuthServiceInterface;
use App\Contracts\Interfaces\BankMiniTransaksiServiceInterface;
use App\Contracts\Interfaces\ChatbotServiceInterface;
use App\Contracts\Interfaces\DashboardServiceInterface;
use App\Contracts\Interfaces\DeviceInboxServiceInterface;
use App\Contracts\Interfaces\DeviceNotificationRepositoryInterface;
use App\Contracts\Interfaces\DocumentRepositoryInterface;
use App\Contracts\Interfaces\DocumentServiceInterface;
use App\Contracts\Interfaces\ExtracurricularRepositoryInterface;
use App\Contracts\Interfaces\ExtracurricularServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\GalleryRepositoryInterface;
use App\Contracts\Interfaces\GalleryServiceInterface;
use App\Contracts\Interfaces\GraduateImportServiceInterface;
use App\Contracts\Interfaces\GraduateRepositoryInterface;
use App\Contracts\Interfaces\GraduateServiceInterface;
use App\Contracts\Interfaces\GraduationServiceInterface;
use App\Contracts\Interfaces\GraduationSettingRepositoryInterface;
use App\Contracts\Interfaces\GuestMessageRepositoryInterface;
use App\Contracts\Interfaces\GuestMessageServiceInterface;
use App\Contracts\Interfaces\GuestVisitRepositoryInterface;
use App\Contracts\Interfaces\GuestVisitServiceInterface;
use App\Contracts\Interfaces\HeroRepositoryInterface;
use App\Contracts\Interfaces\HeroServiceInterface;
use App\Contracts\Interfaces\HomeServiceInterface;
use App\Contracts\Interfaces\IndustryPartnerRepositoryInterface;
use App\Contracts\Interfaces\IndustryPartnerServiceInterface;
use App\Contracts\Interfaces\InternshipDocumentationRepositoryInterface;
use App\Contracts\Interfaces\InternshipDocumentationServiceInterface;
use App\Contracts\Interfaces\JobVacancyRepositoryInterface;
use App\Contracts\Interfaces\JobVacancyServiceInterface;
use App\Contracts\Interfaces\LaporanKasRepositoryInterface;
use App\Contracts\Interfaces\MajorQuizMatcherInterface;
use App\Contracts\Interfaces\MajorQuizServiceInterface;
use App\Contracts\Interfaces\MajorQuizSubmissionRepositoryInterface;
use App\Contracts\Interfaces\MajorRepositoryInterface;
use App\Contracts\Interfaces\MajorServiceInterface;
use App\Contracts\Interfaces\MapRepositoryInterface;
use App\Contracts\Interfaces\MapRoutingServiceInterface;
use App\Contracts\Interfaces\MapServiceInterface;
use App\Contracts\Interfaces\MonitoringKelasServiceInterface;
use App\Contracts\Interfaces\NotifikasiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\PembayaranMasukRepositoryInterface;
use App\Contracts\Interfaces\PortalLinkRepositoryInterface;
use App\Contracts\Interfaces\PortalLinkServiceInterface;
use App\Contracts\Interfaces\PracticeUniformRepositoryInterface;
use App\Contracts\Interfaces\PracticeUniformServiceInterface;
use App\Contracts\Interfaces\PushSubscriptionRepositoryInterface;
use App\Contracts\Interfaces\RoomCategoryRepositoryInterface;
use App\Contracts\Interfaces\RoomCategoryServiceInterface;
use App\Contracts\Interfaces\RoomRepositoryInterface;
use App\Contracts\Interfaces\RoomServiceInterface;
use App\Contracts\Interfaces\SchoolAdministrationDashboardServiceInterface;
use App\Contracts\Interfaces\SchoolEventRepositoryInterface;
use App\Contracts\Interfaces\SchoolEventServiceInterface;
use App\Contracts\Interfaces\SchoolProfileRepositoryInterface;
use App\Contracts\Interfaces\SchoolProfileServiceInterface;
use App\Contracts\Interfaces\SchoolRuleRepositoryInterface;
use App\Contracts\Interfaces\SchoolRuleServiceInterface;
use App\Contracts\Interfaces\SiswaRepositoryInterface;
use App\Contracts\Interfaces\SiteContentRepositoryInterface;
use App\Contracts\Interfaces\SiteContentServiceInterface;
use App\Contracts\Interfaces\SppBillingServiceInterface;
use App\Contracts\Interfaces\StatisticRepositoryInterface;
use App\Contracts\Interfaces\StatisticServiceInterface;
use App\Contracts\Interfaces\TagihanSppRepositoryInterface;
use App\Contracts\Interfaces\TeacherRepositoryInterface;
use App\Contracts\Interfaces\TeacherServiceInterface;
use App\Contracts\Interfaces\TransaksiBankMiniRepositoryInterface;
use App\Contracts\Interfaces\TransaksiDetailBulanRepositoryInterface;
use App\Contracts\Interfaces\TripayServiceInterface;
use App\Contracts\Interfaces\UniformScheduleRepositoryInterface;
use App\Contracts\Interfaces\UniformScheduleServiceInterface;
use App\Contracts\Interfaces\UserRepositoryInterface;
use App\Contracts\Interfaces\WaliKelasAkunServiceInterface;
use App\Contracts\Interfaces\WaliKelasRepositoryInterface;
use App\Contracts\Interfaces\WebPushServiceInterface;
use App\Contracts\Repositories\AchievementRepository;
use App\Contracts\Repositories\AlumniRepository;
use App\Contracts\Repositories\AlumniServiceRequestRepository;
use App\Contracts\Repositories\ArticleRepository;
use App\Contracts\Repositories\DeviceNotificationRepository;
use App\Contracts\Repositories\DocumentRepository;
use App\Contracts\Repositories\ExtracurricularRepository;
use App\Contracts\Repositories\GalleryRepository;
use App\Contracts\Repositories\GraduateRepository;
use App\Contracts\Repositories\GraduationSettingRepository;
use App\Contracts\Repositories\GuestMessageRepository;
use App\Contracts\Repositories\GuestVisitRepository;
use App\Contracts\Repositories\HeroRepository;
use App\Contracts\Repositories\IndustryPartnerRepository;
use App\Contracts\Repositories\InternshipDocumentationRepository;
use App\Contracts\Repositories\JobVacancyRepository;
use App\Contracts\Repositories\LaporanKasRepository;
use App\Contracts\Repositories\MajorQuizSubmissionRepository;
use App\Contracts\Repositories\MajorRepository;
use App\Contracts\Repositories\MapRepository;
use App\Contracts\Repositories\NotifikasiBankMiniRepository;
use App\Contracts\Repositories\PembayaranMasukRepository;
use App\Contracts\Repositories\PortalLinkRepository;
use App\Contracts\Repositories\PracticeUniformRepository;
use App\Contracts\Repositories\PushSubscriptionRepository;
use App\Contracts\Repositories\RoomCategoryRepository;
use App\Contracts\Repositories\RoomRepository;
use App\Contracts\Repositories\SchoolEventRepository;
use App\Contracts\Repositories\SchoolProfileRepository;
use App\Contracts\Repositories\SchoolRuleRepository;
use App\Contracts\Repositories\SiswaRepository;
use App\Contracts\Repositories\SiteContentRepository;
use App\Contracts\Repositories\StatisticRepository;
use App\Contracts\Repositories\TagihanSppRepository;
use App\Contracts\Repositories\TeacherRepository;
use App\Contracts\Repositories\TransaksiBankMiniRepository;
use App\Contracts\Repositories\TransaksiDetailBulanRepository;
use App\Contracts\Repositories\UniformScheduleRepository;
use App\Contracts\Repositories\UserRepository;
use App\Contracts\Repositories\WaliKelasRepository;
use App\Services\Auth\AuthService;
use App\Services\BankMini\BankMiniTransaksiService;
use App\Services\BankMini\MonitoringKelasService;
use App\Services\BankMini\SppBillingService;
use App\Services\BankMini\TripayService;
use App\Services\BankMini\WaliKelasAkunService;
use App\Services\Content\AchievementService;
use App\Services\Content\AlumniService;
use App\Services\Content\ArticleService;
use App\Services\Content\DashboardService;
use App\Services\Content\DocumentService;
use App\Services\Content\ExtracurricularService;
use App\Services\Content\JobVacancyService;
use App\Services\Content\MajorService;
use App\Services\Content\SchoolEventService;
use App\Services\Content\SiteContentService;
use App\Services\Content\TeacherService;
use App\Services\LandingPage\ChatbotService;
use App\Services\LandingPage\FileUploadService;
use App\Services\LandingPage\GalleryService;
use App\Services\LandingPage\HeroService;
use App\Services\LandingPage\HomeService;
use App\Services\LandingPage\MajorQuizMatcher;
use App\Services\LandingPage\MajorQuizService;
use App\Services\LandingPage\MapRoutingService;
use App\Services\LandingPage\MapService;
use App\Services\LandingPage\RoomCategoryService;
use App\Services\LandingPage\RoomService;
use App\Services\LandingPage\SchoolProfileService;
use App\Services\LandingPage\StatisticService;
use App\Services\SchoolAdministration\AlumniServiceRequestService;
use App\Services\SchoolAdministration\DeviceInboxService;
use App\Services\SchoolAdministration\GraduateImportService;
use App\Services\SchoolAdministration\GraduateService;
use App\Services\SchoolAdministration\GraduationService;
use App\Services\SchoolAdministration\GuestMessageService;
use App\Services\SchoolAdministration\GuestVisitService;
use App\Services\SchoolAdministration\IndustryPartnerService;
use App\Services\SchoolAdministration\InternshipDocumentationService;
use App\Services\SchoolAdministration\PortalLinkService;
use App\Services\SchoolAdministration\PracticeUniformService;
use App\Services\SchoolAdministration\SchoolAdministrationDashboardService;
use App\Services\SchoolAdministration\SchoolRuleService;
use App\Services\SchoolAdministration\UniformScheduleService;
use App\Services\SchoolAdministration\WebPushService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
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
        MajorQuizSubmissionRepositoryInterface::class => MajorQuizSubmissionRepository::class,
        SiteContentRepositoryInterface::class => SiteContentRepository::class,
        TeacherRepositoryInterface::class => TeacherRepository::class,
        SchoolEventRepositoryInterface::class => SchoolEventRepository::class,
        DocumentRepositoryInterface::class => DocumentRepository::class,

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
        MajorQuizServiceInterface::class => MajorQuizService::class,
        MajorQuizMatcherInterface::class => MajorQuizMatcher::class,
        MajorServiceInterface::class => MajorService::class,
        AchievementServiceInterface::class => AchievementService::class,
        ExtracurricularServiceInterface::class => ExtracurricularService::class,
        ArticleServiceInterface::class => ArticleService::class,
        JobVacancyServiceInterface::class => JobVacancyService::class,
        AlumniServiceInterface::class => AlumniService::class,
        SiteContentServiceInterface::class => SiteContentService::class,
        TeacherServiceInterface::class => TeacherService::class,
        SchoolEventServiceInterface::class => SchoolEventService::class,
        DocumentServiceInterface::class => DocumentService::class,
        DashboardServiceInterface::class => DashboardService::class,
        AuthServiceInterface::class => AuthService::class,

        FileUploadServiceInterface::class => FileUploadService::class,

        // Modul Admin TU & Layanan Informasi Publik
        GraduateRepositoryInterface::class => GraduateRepository::class,
        GraduationSettingRepositoryInterface::class => GraduationSettingRepository::class,
        AlumniServiceRequestRepositoryInterface::class => AlumniServiceRequestRepository::class,
        DeviceNotificationRepositoryInterface::class => DeviceNotificationRepository::class,
        PushSubscriptionRepositoryInterface::class => PushSubscriptionRepository::class,
        IndustryPartnerRepositoryInterface::class => IndustryPartnerRepository::class,
        InternshipDocumentationRepositoryInterface::class => InternshipDocumentationRepository::class,
        SchoolRuleRepositoryInterface::class => SchoolRuleRepository::class,
        UniformScheduleRepositoryInterface::class => UniformScheduleRepository::class,
        PracticeUniformRepositoryInterface::class => PracticeUniformRepository::class,
        GuestMessageRepositoryInterface::class => GuestMessageRepository::class,
        GuestVisitRepositoryInterface::class => GuestVisitRepository::class,
        PortalLinkRepositoryInterface::class => PortalLinkRepository::class,

        GraduationServiceInterface::class => GraduationService::class,
        GraduateServiceInterface::class => GraduateService::class,
        GraduateImportServiceInterface::class => GraduateImportService::class,
        AlumniServiceRequestServiceInterface::class => AlumniServiceRequestService::class,
        DeviceInboxServiceInterface::class => DeviceInboxService::class,
        WebPushServiceInterface::class => WebPushService::class,
        IndustryPartnerServiceInterface::class => IndustryPartnerService::class,
        InternshipDocumentationServiceInterface::class => InternshipDocumentationService::class,
        SchoolRuleServiceInterface::class => SchoolRuleService::class,
        UniformScheduleServiceInterface::class => UniformScheduleService::class,
        PracticeUniformServiceInterface::class => PracticeUniformService::class,
        GuestMessageServiceInterface::class => GuestMessageService::class,
        GuestVisitServiceInterface::class => GuestVisitService::class,
        PortalLinkServiceInterface::class => PortalLinkService::class,
        SchoolAdministrationDashboardServiceInterface::class => SchoolAdministrationDashboardService::class,

        // Modul Bank Mini & Pembayaran SPP
        UserRepositoryInterface::class => UserRepository::class,
        SiswaRepositoryInterface::class => SiswaRepository::class,
        TagihanSppRepositoryInterface::class => TagihanSppRepository::class,
        TransaksiBankMiniRepositoryInterface::class => TransaksiBankMiniRepository::class,
        TransaksiDetailBulanRepositoryInterface::class => TransaksiDetailBulanRepository::class,
        NotifikasiBankMiniRepositoryInterface::class => NotifikasiBankMiniRepository::class,
        PembayaranMasukRepositoryInterface::class => PembayaranMasukRepository::class,
        LaporanKasRepositoryInterface::class => LaporanKasRepository::class,
        WaliKelasRepositoryInterface::class => WaliKelasRepository::class,
        WaliKelasAkunServiceInterface::class => WaliKelasAkunService::class,
        MonitoringKelasServiceInterface::class => MonitoringKelasService::class,
        SppBillingServiceInterface::class => SppBillingService::class,
        BankMiniTransaksiServiceInterface::class => BankMiniTransaksiService::class,
        TripayServiceInterface::class => TripayService::class,
    ];

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        foreach ($this->register as $index => $value) {
            $this->app->bind($index, $value);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(): void
    {
        // Endpoint publik dibatasi per IP agar bot tidak membanjiri server. Server Next.js
        // sendiri tidak dibatasi karena semua pengunjung yang dirender berbagi IP-nya.
        RateLimiter::for('public-api', function (Request $request) {
            if (in_array($request->ip(), config('services.frontend.server_ips'), true)) {
                return Limit::none();
            }

            return Limit::perMinute(300)->by($request->ip());
        });
    }
}
