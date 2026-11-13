<?php

namespace App\Helpers;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * Token perangkat adalah UUID acak yang dibuat browser pengaju dan disimpan di localStorage.
 * Dikirim lewat header X-Device-Token; siapa pun yang memegang token bisa melihat lonceng perangkat itu.
 */
class DeviceTokenHelper
{
    public const HEADER = 'X-Device-Token';

    /**
     * Ambil token perangkat dari header, atau hentikan request dengan 422 bila tidak valid.
     *
     *
     * @param  Request  $request
     * @return string
     *
     * @throws HttpResponseException
     */
    public static function require(Request $request): string
    {
        $token = strtolower(trim((string) $request->header(self::HEADER)));

        if (! Str::isUuid($token)) {
            ResponseHelper::error(null, trans('alert.device_token_invalid'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return $token;
    }
}
