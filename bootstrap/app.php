<?php

use App\Helpers\BankMiniBeranda;
use App\Helpers\ResponseHelper;
use App\Http\Middleware\BankMiniBukaMiddleware;
use App\Http\Middleware\BankMiniRoleMiddleware;
use App\Http\Middleware\CheckRoleMiddleware;
use App\Http\Middleware\SecurityHeadersMiddleware;
use App\Http\Middleware\TripayCallbackSignatureMiddleware;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => CheckRoleMiddleware::class,
            'tripay.signature' => TripayCallbackSignatureMiddleware::class,
            'bank-mini.role' => BankMiniRoleMiddleware::class,
            'bank-mini.buka' => BankMiniBukaMiddleware::class,
        ]);

        $middleware->api(append: [SecurityHeadersMiddleware::class]);

        // Portal Bank Mini (Blade + sesi): tamu diarahkan ke halaman login yang sesuai area.
        $middleware->redirectGuestsTo(fn (Request $request) => match (true) {
            $request->is('bank-mini/admin*') => route('bank-mini.admin.login'),
            $request->is('bank-mini/wali-kelas*') => route('bank-mini.walas.login'),
            default => route('bank-mini.login'),
        });
        $middleware->redirectUsersTo(fn (Request $request) => $request->is('bank-mini/admin*', 'bank-mini/wali-kelas*')
            ? BankMiniBeranda::staf($request->user())
            : route('bank-mini.dashboard'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $isApi = fn (Request $request) => $request->is('api/*') || $request->expectsJson();

        $exceptions->shouldRenderJsonWhen($isApi);

        $exceptions->render(function (Throwable $e, Request $request) use ($isApi) {
            if (! $isApi($request)) {
                return null;
            }

            if ($e instanceof HttpResponseException) {
                return $e->getResponse();
            }

            try {
                return match (true) {
                    $e instanceof ValidationException => ResponseHelper::error($e->errors(), trans('alert.validation_failed'), 422),
                    $e instanceof AuthenticationException => ResponseHelper::error(null, trans('alert.unauthenticated'), 401),
                    $e instanceof AuthorizationException => ResponseHelper::error(null, trans('alert.forbidden'), 403),
                    $e instanceof ModelNotFoundException => ResponseHelper::error(null, trans('alert.not_found'), 404),
                    $e instanceof NotFoundHttpException && $e->getPrevious() instanceof ModelNotFoundException => ResponseHelper::error(null, trans('alert.not_found'), 404),
                    $e instanceof NotFoundHttpException => ResponseHelper::error(null, trans('alert.endpoint_not_found'), 404),
                    $e instanceof TooManyRequestsHttpException => ResponseHelper::error(null, trans('alert.too_many_requests'), 429),
                    $e instanceof HttpExceptionInterface => ResponseHelper::error(null, trans('alert.http_error'), $e->getStatusCode()),
                    default => ResponseHelper::error(null, trans('alert.internal_error'), 500),
                };
            } catch (HttpResponseException $response) {
                return $response->getResponse();
            }
        });
    })->create();
