<?php

/*
 * Dashboard Admin TU, dimuat di /api/v1/admin/tu dengan auth:sanctum + role admin / admin_tu.
 * Update data berkas memakai POST juga agar unggahan multipart terbaca Laravel.
 */

use App\Http\Controllers\Admin\AlumniServiceRequestController;
use App\Http\Controllers\Admin\GraduateController;
use App\Http\Controllers\Admin\GraduateImportController;
use App\Http\Controllers\Admin\GraduationSettingController;
use App\Http\Controllers\Admin\GuestMessageController;
use App\Http\Controllers\Admin\GuestVisitController;
use App\Http\Controllers\Admin\IndustryPartnerController;
use App\Http\Controllers\Admin\InternshipDocumentationController;
use App\Http\Controllers\Admin\PortalLinkController;
use App\Http\Controllers\Admin\PracticeUniformController;
use App\Http\Controllers\Admin\SchoolAdministrationDashboardController;
use App\Http\Controllers\Admin\SchoolRuleController;
use App\Http\Controllers\Admin\UniformScheduleController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [SchoolAdministrationDashboardController::class, 'index']);

Route::get('/graduation-settings', [GraduationSettingController::class, 'show']);
Route::match(['put', 'patch'], '/graduation-settings', [GraduationSettingController::class, 'update']);

Route::get('/graduates/years', [GraduateController::class, 'years']);
Route::post('/graduates/import', [GraduateImportController::class, 'store'])->middleware('throttle:10,1,graduate-import');
Route::post('/graduates/archive', [GraduateController::class, 'archive']);
Route::delete('/graduates/years', [GraduateController::class, 'destroyYear']);
Route::get('/graduates', [GraduateController::class, 'index']);
Route::post('/graduates', [GraduateController::class, 'store']);
Route::match(['put', 'patch'], '/graduates/{id}', [GraduateController::class, 'update'])->whereNumber('id');
Route::delete('/graduates/{id}', [GraduateController::class, 'destroy'])->whereNumber('id');

Route::get('/alumni-services', [AlumniServiceRequestController::class, 'index']);
Route::match(['put', 'patch'], '/alumni-services/{id}', [AlumniServiceRequestController::class, 'update'])->whereNumber('id');
Route::delete('/alumni-services/{id}', [AlumniServiceRequestController::class, 'destroy'])->whereNumber('id');

$crud = [
    'industry-partners' => IndustryPartnerController::class,
    'internship-documentations' => InternshipDocumentationController::class,
    'school-rules' => SchoolRuleController::class,
    'guest-visits' => GuestVisitController::class,
];

foreach ($crud as $uri => $controller) {
    Route::get("/{$uri}", [$controller, 'index']);
    Route::post("/{$uri}", [$controller, 'store']);
    Route::get("/{$uri}/{id}", [$controller, 'show'])->whereNumber('id');
    Route::match(['put', 'patch', 'post'], "/{$uri}/{id}", [$controller, 'update'])->whereNumber('id');
    Route::delete("/{$uri}/{id}", [$controller, 'destroy'])->whereNumber('id');
}

$editable = [
    'uniform-schedules' => UniformScheduleController::class,
    'practice-uniforms' => PracticeUniformController::class,
    'portal-links' => PortalLinkController::class,
];

foreach ($editable as $uri => $controller) {
    Route::get("/{$uri}", [$controller, 'index']);
    Route::match(['put', 'patch', 'post'], "/{$uri}/{id}", [$controller, 'update'])->whereNumber('id');
}

Route::get('/guest-messages', [GuestMessageController::class, 'index']);
Route::match(['put', 'patch'], '/guest-messages/{id}', [GuestMessageController::class, 'update'])->whereNumber('id');
Route::delete('/guest-messages/{id}', [GuestMessageController::class, 'destroy'])->whereNumber('id');
