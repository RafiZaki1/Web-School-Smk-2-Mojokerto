<?php

use App\Http\Controllers\Api\Admin\AchievementController as AdminAchievementController;
use App\Http\Controllers\Api\Admin\AdminFacilityController;
use App\Http\Controllers\Api\Admin\AdminMapEdgeController;
use App\Http\Controllers\Api\Admin\AdminMapNodeController;
use App\Http\Controllers\Api\Admin\AdminRoomCategoryController;
use App\Http\Controllers\Api\Admin\AdminRoomController;
use App\Http\Controllers\Api\Admin\AlumniController as AdminAlumniController;
use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\Admin\AspirationController as AdminAspirationController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ExtracurricularController as AdminExtracurricularController;
use App\Http\Controllers\Api\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Api\Admin\HeroController as AdminHeroController;
use App\Http\Controllers\Api\Admin\JobVacancyController as AdminJobVacancyController;
use App\Http\Controllers\Api\Admin\MajorController as AdminMajorController;
use App\Http\Controllers\Api\Admin\SchoolProfileController as AdminSchoolProfileController;
use App\Http\Controllers\Api\Admin\SiteContentController as AdminSiteContentController;
use App\Http\Controllers\Api\Public\AchievementPublicController;
use App\Http\Controllers\Api\Public\AlumniPublicController;
use App\Http\Controllers\Api\Public\ArticlePublicController;
use App\Http\Controllers\Api\Public\AspirationPublicController;
use App\Http\Controllers\Api\Public\ChatbotController as PublicChatbotController;
use App\Http\Controllers\Api\Public\ExtracurricularPublicController;
use App\Http\Controllers\Api\Public\GalleryPublicController;
use App\Http\Controllers\Api\Public\HeroPublicController;
use App\Http\Controllers\Api\Public\HomeController;
use App\Http\Controllers\Api\Public\JobVacancyPublicController;
use App\Http\Controllers\Api\Public\MajorPublicController;
use App\Http\Controllers\Api\Public\MapPublicController;
use App\Http\Controllers\Api\Public\RoomPublicController;
use App\Http\Controllers\Api\Public\SchoolProfilePublicController;
use App\Http\Controllers\Api\Public\SiteContentPublicController;
use App\Http\Controllers\Api\Public\StatisticController;
use App\Models\SiteContent;
use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function () {
    // ==========================================
    // PUBLIC ROUTES
    // ==========================================
    Route::prefix('public')->group(function () {
        Route::get('/home', [HomeController::class, 'index']);
        Route::get('/statistics', [StatisticController::class, 'index']);
        Route::get('/heroes', [HeroPublicController::class, 'index']);
        Route::get('/galleries', [GalleryPublicController::class, 'index']);
        Route::get('/school-profile', [SchoolProfilePublicController::class, 'show']);

        // Chatbot AI
        Route::post('/chatbot', [PublicChatbotController::class, 'send'])->middleware('throttle:30,1');

        // Interactive Map & Routing
        Route::get('/map/route', [MapPublicController::class, 'route']);
        Route::get('/map/categories', [MapPublicController::class, 'categories']);
        Route::get('/map/nodes', [MapPublicController::class, 'nodes']);

        // Rooms & Facilities
        Route::get('/rooms/search', [RoomPublicController::class, 'search']);
        Route::get('/rooms', [RoomPublicController::class, 'index']);
        Route::get('/rooms/{room}', [RoomPublicController::class, 'show']);
        Route::get('/rooms/{room}/facilities', [RoomPublicController::class, 'facilities']);

        // Jurusan
        Route::get('/majors', [MajorPublicController::class, 'index']);
        Route::get('/majors/{slug}', [MajorPublicController::class, 'show']);

        // Prestasi
        Route::get('/achievements', [AchievementPublicController::class, 'index']);
        Route::get('/achievements/{slug}', [AchievementPublicController::class, 'show']);

        // Ekstrakurikuler
        Route::get('/extracurriculars', [ExtracurricularPublicController::class, 'index']);
        Route::get('/extracurriculars/{slug}', [ExtracurricularPublicController::class, 'show']);

        // Berita & Artikel
        Route::get('/articles/categories', [ArticlePublicController::class, 'categories']);
        Route::get('/articles', [ArticlePublicController::class, 'index']);
        Route::get('/articles/{slug}', [ArticlePublicController::class, 'show']);

        // Loker & BKK
        Route::get('/jobs/options', [JobVacancyPublicController::class, 'options']);
        Route::get('/jobs', [JobVacancyPublicController::class, 'index']);
        Route::get('/jobs/{slug}', [JobVacancyPublicController::class, 'show']);

        // Lulusan
        Route::get('/alumni', [AlumniPublicController::class, 'index']);

        // Kotak Aspirasi
        Route::get('/aspirations', [AspirationPublicController::class, 'index']);
        Route::post('/aspirations', [AspirationPublicController::class, 'store'])->middleware('throttle:5,1');

        // Konten halaman (bkk, spmb, produk, sejarah, fasilitas, kontak, mitra)
        Route::get('/contents/{key}', [SiteContentPublicController::class, 'show'])->whereIn('key', SiteContent::KEYS);
    });

    // ==========================================
    // ADMIN AUTH
    // ==========================================
    Route::post('/admin/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    
    Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/dashboard', [DashboardController::class, 'index']);

        $contentRoutes = [
            'majors' => AdminMajorController::class,
            'achievements' => AdminAchievementController::class,
            'extracurriculars' => AdminExtracurricularController::class,
            'articles' => AdminArticleController::class,
            'jobs' => AdminJobVacancyController::class,
            'alumni' => AdminAlumniController::class,
        ];

        foreach ($contentRoutes as $uri => $controller) {
            Route::get("/{$uri}", [$controller, 'index']);
            Route::post("/{$uri}", [$controller, 'store']);
            Route::get("/{$uri}/{id}", [$controller, 'show']);
            Route::match(['put', 'patch', 'post'], "/{$uri}/{id}", [$controller, 'update']);
            Route::delete("/{$uri}/{id}", [$controller, 'destroy']);
        }

        // Aspirasi
        Route::get('/aspirations', [AdminAspirationController::class, 'index']);
        Route::get('/aspirations/{id}', [AdminAspirationController::class, 'show']);
        Route::match(['put', 'patch'], '/aspirations/{id}', [AdminAspirationController::class, 'update']);
        Route::delete('/aspirations/{id}', [AdminAspirationController::class, 'destroy']);

        // Konten halaman
        Route::get('/contents/{key}', [AdminSiteContentController::class, 'show'])->whereIn('key', SiteContent::KEYS);
        Route::match(['put', 'patch'], '/contents/{key}', [AdminSiteContentController::class, 'update'])->whereIn('key', SiteContent::KEYS);

        // Heroes
        Route::get('/heroes', [AdminHeroController::class, 'index']);
        Route::post('/heroes', [AdminHeroController::class, 'store']);
        Route::get('/heroes/{id}', [AdminHeroController::class, 'show']);
        Route::match(['put', 'patch', 'post'], '/heroes/{id}', [AdminHeroController::class, 'update']);
        Route::delete('/heroes/{id}', [AdminHeroController::class, 'destroy']);

        // Galleries
        Route::get('/galleries', [AdminGalleryController::class, 'index']);
        Route::post('/galleries', [AdminGalleryController::class, 'store']);
        Route::get('/galleries/{id}', [AdminGalleryController::class, 'show']);
        Route::match(['put', 'patch', 'post'], '/galleries/{id}', [AdminGalleryController::class, 'update']);
        Route::delete('/galleries/{id}', [AdminGalleryController::class, 'destroy']);

        // School Profile
        Route::get('/school-profile', [AdminSchoolProfileController::class, 'show']);
        Route::match(['put', 'patch', 'post'], '/school-profile', [AdminSchoolProfileController::class, 'update']);

        // Rooms CRUD
        Route::get('/rooms', [AdminRoomController::class, 'index']);
        Route::post('/rooms', [AdminRoomController::class, 'store']);
        Route::get('/rooms/{room}', [AdminRoomController::class, 'show']);
        Route::match(['put', 'patch', 'post'], '/rooms/{room}', [AdminRoomController::class, 'update']);
        Route::delete('/rooms/{room}', [AdminRoomController::class, 'destroy']);

        // Facilities per Room CRUD
        Route::get('/rooms/{room}/facilities', [AdminFacilityController::class, 'index']);
        Route::post('/rooms/{room}/facilities', [AdminFacilityController::class, 'store']);
        Route::match(['put', 'patch'], '/rooms/{room}/facilities/{facility}', [AdminFacilityController::class, 'update']);
        Route::delete('/rooms/{room}/facilities/{facility}', [AdminFacilityController::class, 'destroy']);

        // Room Categories CRUD
        Route::get('/room-categories', [AdminRoomCategoryController::class, 'index']);
        Route::post('/room-categories', [AdminRoomCategoryController::class, 'store']);
        Route::get('/room-categories/{room_category}', [AdminRoomCategoryController::class, 'show']);
        Route::match(['put', 'patch'], '/room-categories/{room_category}', [AdminRoomCategoryController::class, 'update']);
        Route::delete('/room-categories/{room_category}', [AdminRoomCategoryController::class, 'destroy']);

        // Map Nodes CRUD
        Route::get('/map/nodes', [AdminMapNodeController::class, 'index']);
        Route::post('/map/nodes', [AdminMapNodeController::class, 'store']);
        Route::get('/map/nodes/{node}', [AdminMapNodeController::class, 'show']);
        Route::match(['put', 'patch'], '/map/nodes/{node}', [AdminMapNodeController::class, 'update']);
        Route::delete('/map/nodes/{node}', [AdminMapNodeController::class, 'destroy']);

        // Map Edges CRUD
        Route::get('/map/edges', [AdminMapEdgeController::class, 'index']);
        Route::post('/map/edges', [AdminMapEdgeController::class, 'store']);
        Route::get('/map/edges/{edge}', [AdminMapEdgeController::class, 'show']);
        Route::match(['put', 'patch'], '/map/edges/{edge}', [AdminMapEdgeController::class, 'update']);
        Route::delete('/map/edges/{edge}', [AdminMapEdgeController::class, 'destroy']);
    });
});
