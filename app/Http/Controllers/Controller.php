<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

abstract class Controller extends BaseController
{
    /**
     * Ubah galat pada operasi tulis menjadi respons standar API.
     * Data yang tidak ditemukan menghasilkan 404, galat lain dicatat ke log dan dibalas 500 tanpa detail teknis.
     */
    protected function writeError(Throwable $th): JsonResponse
    {
        if ($th instanceof ModelNotFoundException) {
            return ResponseHelper::error(null, trans('alert.not_found'), Response::HTTP_NOT_FOUND);
        }

        Log::error($th);

        return ResponseHelper::error(null, trans('alert.internal_error'), Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
