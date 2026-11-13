<?php

use App\Enums\RoleEnum;
use App\Enums\SiteContentKeyEnum;
use App\Http\Controllers\Admin\AchievementController as AdminAchievementController;
use App\Http\Controllers\Admin\AdminFacilityController;
use App\Http\Controllers\Admin\AdminMapEdgeController;
use App\Http\Controllers\Admin\AdminMapNodeController;
use App\Http\Controllers\Admin\AdminRoomCategoryController;
use App\Http\Controllers\Admin\AdminRoomController;
use App\Http\Controllers\Admin\AlumniController as AdminAlumniController;
use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExtracurricularController as AdminExtracurricularController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\HeroController as AdminHeroController;
use App\Http\Controllers\Admin\JobVacancyController as AdminJobVacancyController;
use App\Http\Controllers\Admin\MajorController as AdminMajorController;
use App\Http\Controllers\Admin\MajorQuizSubmissionController as AdminMajorQuizSubmissionController;
use App\Http\Controllers\Admin\SchoolProfileController as AdminSchoolProfileController;
use App\Http\Controllers\Admin\SiteContentController as AdminSiteContentController;
use App\Http\Controllers\LandingPage\AchievementPublicController;
use App\Http\Controllers\LandingPage\AlumniPublicController;
use App\Http\Controllers\LandingPage\ArticlePublicController;
use App\Http\Controllers\LandingPage\ChatbotController as PublicChatbotController;
use App\Http\Controllers\LandingPage\ExtracurricularPublicController;
use App\Http\Controllers\LandingPage\GalleryPublicController;
use App\Http\Controllers\LandingPage\HeroPublicController;
use App\Http\Controllers\LandingPage\HomeController;
use App\Http\Controllers\LandingPage\JobVacancyPublicController;
use App\Http\Controllers\LandingPage\MajorPublicController;
use App\Http\Controllers\LandingPage\MajorQuizController;
use App\Http\Controllers\LandingPage\MapPublicController;
use App\Http\Controllers\LandingPage\RoomPublicController;
use App\Http\Controllers\LandingPage\SchoolProfilePublicController;
use App\Http\Controllers\LandingPage\SiteContentPublicController;
use App\Http\Controllers\LandingPage\StatisticController;
use App\Http\Controllers\BankMini\TripayCallbackController;
use Illuminate\Support\Facades\Route;

/*
 * Modul Admin TU & Layanan Informasi Publik ada di routes/school-administration-public.php
 * (dimuat di grup public) dan routes/school-administration-admin.php (prefix admin/tu).
 */

Route::prefix('v1')->group(function () {
    Route::prefix('public')->middleware('throttle:public-api')->group(function () {
        Route::get('/home', [HomeController::class, 'index']);
        Route::get('/statistics', [StatisticController::class, 'index']);
        Route::get('/heroes', [HeroPublicController::class, 'index']);
        Route::get('/galleries', [GalleryPublicController::class, 'index']);
        Route::get('/school-profile', [SchoolProfilePublicController::class, 'show']);

        Route::post('/chatbot', [PublicChatbotController::class, 'send'])->middleware('throttle:30,1');

        Route::get('/map/route', [MapPublicController::class, 'route']);
        Route::get('/map/categories', [MapPublicController::class, 'categories']);
        Route::get('/map/nodes', [MapPublicController::class, 'nodes']);

        Route::get('/rooms/search', [RoomPublicController::class, 'search']);
        Route::get('/rooms', [RoomPublicController::class, 'index']);
        Route::get('/rooms/{room}', [RoomPublicController::class, 'show']);
        Route::get('/rooms/{room}/facilities', [RoomPublicController::class, 'facilities']);

        Route::get('/majors', [MajorPublicController::class, 'index']);
        Route::get('/majors/{slug}', [MajorPublicController::class, 'show']);

        Route::get('/major-quiz/questions', [MajorQuizController::class, 'questions']);
        Route::post('/major-quiz/submissions', [MajorQuizController::class, 'submit'])->middleware('throttle:10,1');
        Route::get('/major-quiz/submissions/{code}', [MajorQuizController::class, 'show'])->middleware('throttle:30,1');

        Route::get('/achievements', [AchievementPublicController::class, 'index']);
        Route::get('/achievements/{slug}', [AchievementPublicController::class, 'show']);

        Route::get('/extracurriculars', [ExtracurricularPublicController::class, 'index']);
        Route::get('/extracurriculars/{slug}', [ExtracurricularPublicController::class, 'show']);

        Route::get('/articles/categories', [ArticlePublicController::class, 'categories']);
        Route::get('/articles', [ArticlePublicController::class, 'index']);
        Route::get('/articles/{slug}', [ArticlePublicController::class, 'show']);

        Route::get('/jobs/options', [JobVacancyPublicController::class, 'options']);
        Route::get('/jobs', [JobVacancyPublicController::class, 'index']);
        Route::get('/jobs/{slug}', [JobVacancyPublicController::class, 'show']);

        Route::get('/alumni', [AlumniPublicController::class, 'index']);

        Route::get('/contents/{key}', [SiteContentPublicController::class, 'show'])->whereIn('key', SiteContentKeyEnum::values());

        require __DIR__.'/school-administration-public.php';
    });

    Route::post('/admin/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    // Profil & logout dipakai admin utama maupun akun bersama Tata Usaha.
    Route::prefix('admin')->middleware(['auth:sanctum', 'role:'.RoleEnum::ADMIN->value.','.RoleEnum::ADMIN_TU->value])->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::prefix('tu')->group(__DIR__.'/school-administration-admin.php');
    });

    Route::prefix('admin')->middleware(['auth:sanctum', 'role:'.RoleEnum::ADMIN->value])->group(function () {
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

        Route::get('/major-quiz-submissions', [AdminMajorQuizSubmissionController::class, 'index']);
        Route::get('/major-quiz-submissions/{id}', [AdminMajorQuizSubmissionController::class, 'show']);
        Route::match(['put', 'patch'], '/major-quiz-submissions/{id}', [AdminMajorQuizSubmissionController::class, 'update']);
        Route::delete('/major-quiz-submissions/{id}', [AdminMajorQuizSubmissionController::class, 'destroy']);

        Route::get('/contents/{key}', [AdminSiteContentController::class, 'show'])->whereIn('key', SiteContentKeyEnum::values());
        Route::match(['put', 'patch'], '/contents/{key}', [AdminSiteContentController::class, 'update'])->whereIn('key', SiteContentKeyEnum::values());

        Route::get('/heroes', [AdminHeroController::class, 'index']);
        Route::post('/heroes', [AdminHeroController::class, 'store']);
        Route::get('/heroes/{id}', [AdminHeroController::class, 'show']);
        Route::match(['put', 'patch', 'post'], '/heroes/{id}', [AdminHeroController::class, 'update']);
        Route::delete('/heroes/{id}', [AdminHeroController::class, 'destroy']);

        Route::get('/galleries', [AdminGalleryController::class, 'index']);
        Route::post('/galleries', [AdminGalleryController::class, 'store']);
        Route::get('/galleries/{id}', [AdminGalleryController::class, 'show']);
        Route::match(['put', 'patch', 'post'], '/galleries/{id}', [AdminGalleryController::class, 'update']);
        Route::delete('/galleries/{id}', [AdminGalleryController::class, 'destroy']);

        Route::get('/school-profile', [AdminSchoolProfileController::class, 'show']);
        Route::match(['put', 'patch', 'post'], '/school-profile', [AdminSchoolProfileController::class, 'update']);

        Route::get('/rooms', [AdminRoomController::class, 'index']);
        Route::post('/rooms', [AdminRoomController::class, 'store']);
        Route::get('/rooms/{room}', [AdminRoomController::class, 'show']);
        Route::match(['put', 'patch', 'post'], '/rooms/{room}', [AdminRoomController::class, 'update']);
        Route::delete('/rooms/{room}', [AdminRoomController::class, 'destroy']);

        Route::get('/rooms/{room}/facilities', [AdminFacilityController::class, 'index']);
        Route::post('/rooms/{room}/facilities', [AdminFacilityController::class, 'store']);
        Route::match(['put', 'patch'], '/rooms/{room}/facilities/{facility}', [AdminFacilityController::class, 'update']);
        Route::delete('/rooms/{room}/facilities/{facility}', [AdminFacilityController::class, 'destroy']);

        Route::get('/room-categories', [AdminRoomCategoryController::class, 'index']);
        Route::post('/room-categories', [AdminRoomCategoryController::class, 'store']);
        Route::get('/room-categories/{room_category}', [AdminRoomCategoryController::class, 'show']);
        Route::match(['put', 'patch'], '/room-categories/{room_category}', [AdminRoomCategoryController::class, 'update']);
        Route::delete('/room-categories/{room_category}', [AdminRoomCategoryController::class, 'destroy']);

        Route::get('/map/nodes', [AdminMapNodeController::class, 'index']);
        Route::post('/map/nodes', [AdminMapNodeController::class, 'store']);
        Route::get('/map/nodes/{node}', [AdminMapNodeController::class, 'show']);
        Route::match(['put', 'patch'], '/map/nodes/{node}', [AdminMapNodeController::class, 'update']);
        Route::delete('/map/nodes/{node}', [AdminMapNodeController::class, 'destroy']);

        Route::get('/map/edges', [AdminMapEdgeController::class, 'index']);
        Route::post('/map/edges', [AdminMapEdgeController::class, 'store']);
        Route::get('/map/edges/{edge}', [AdminMapEdgeController::class, 'show']);
        Route::match(['put', 'patch'], '/map/edges/{edge}', [AdminMapEdgeController::class, 'update']);
        Route::delete('/map/edges/{edge}', [AdminMapEdgeController::class, 'destroy']);
    });
});

// Callback Tripay modul Bank Mini (tanpa CSRF; signature HMAC-SHA256 dicek middleware tripay.signature).
Route::post('/bank-mini/webhook', [TripayCallbackController::class, 'handle'])
    ->middleware(['tripay.signature', 'throttle:120,1'])
    ->name('bank-mini.webhook');
