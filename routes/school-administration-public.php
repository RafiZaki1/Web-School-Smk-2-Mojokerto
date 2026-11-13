<?php

/*
 * Endpoint publik modul TU, dimuat di dalam grup /api/v1/public (throttle:public-api).
 * Endpoint perangkat membaca header X-Device-Token (UUID dari localStorage pengaju).
 */

use App\Http\Controllers\LandingPage\AlumniServicePublicController;
use App\Http\Controllers\LandingPage\DeviceInboxPublicController;
use App\Http\Controllers\LandingPage\GraduationPublicController;
use App\Http\Controllers\LandingPage\GuestBookPublicController;
use App\Http\Controllers\LandingPage\IndustryPartnerPublicController;
use App\Http\Controllers\LandingPage\InternshipDocumentationPublicController;
use App\Http\Controllers\LandingPage\PortalLinkPublicController;
use App\Http\Controllers\LandingPage\PushSubscriptionPublicController;
use App\Http\Controllers\LandingPage\StudentGuidePublicController;
use Illuminate\Support\Facades\Route;

Route::get('/graduation/status', [GraduationPublicController::class, 'status']);
Route::post('/graduation/check', [GraduationPublicController::class, 'check'])->middleware('throttle:10,1,graduation-check');

Route::post('/alumni-services', [AlumniServicePublicController::class, 'store'])->middleware('throttle:5,1,alumni-service');
Route::get('/alumni-services/device', [AlumniServicePublicController::class, 'device']);

Route::get('/device-notifications', [DeviceInboxPublicController::class, 'index']);
Route::post('/device-notifications/read', [DeviceInboxPublicController::class, 'markRead']);

Route::get('/push/key', [PushSubscriptionPublicController::class, 'key']);
Route::post('/push/subscriptions', [PushSubscriptionPublicController::class, 'store'])->middleware('throttle:10,1,push-subscription');
Route::delete('/push/subscriptions', [PushSubscriptionPublicController::class, 'destroy']);

Route::get('/industry-partners', [IndustryPartnerPublicController::class, 'index']);
Route::get('/internship-documentations', [InternshipDocumentationPublicController::class, 'index']);
Route::get('/student-guide', [StudentGuidePublicController::class, 'index']);
Route::get('/portal-links', [PortalLinkPublicController::class, 'index']);

Route::post('/guest-book/messages', [GuestBookPublicController::class, 'storeMessage'])->middleware('throttle:5,1,guest-message');
Route::post('/guest-book/visits', [GuestBookPublicController::class, 'storeVisit'])->middleware('throttle:5,1,guest-visit');
