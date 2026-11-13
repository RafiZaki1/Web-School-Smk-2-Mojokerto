<?php

namespace App\Helpers;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Response;

class ResponseHelper
{
    /**
     * Membentuk respons sukses dengan format standar API.
     *
     * @param  mixed  $data
     * @param  ?string  $message
     * @param  int  $code
     * @return JsonResponse
     */
    public static function success(mixed $data = null, ?string $message = null, int $code = Response::HTTP_OK): JsonResponse
    {
        return response()->json(self::envelope($data, $message, $code, 'success', true), $code);
    }

    /**
     * Menghentikan alur dengan respons galat berformat standar API.
     *
     *
     * @param  mixed  $data
     * @param  ?string  $message
     * @param  int  $code
     * @return JsonResponse
     *
     * @throws HttpResponseException
     */
    public static function error(mixed $data = null, ?string $message = null, int $code = Response::HTTP_BAD_REQUEST): JsonResponse
    {
        throw new HttpResponseException(
            response()->json(self::envelope($data, $message, $code, 'error', false), $code)
        );
    }

    /**
     * Membentuk respons data berhalaman: data.paginate berisi info halaman, data.data berisi baris lewat API Resource.
     *
     * @param  class-string<JsonResource>  $resource
     * @param  array<string, mixed>  $extra  Data tambahan di samping daftar, mis. ringkasan jumlah.
     * @param  LengthAwarePaginator  $paginator
     * @param  ?string  $message
     * @return JsonResponse
     */
    public static function paginate(LengthAwarePaginator $paginator, string $resource, ?string $message = null, array $extra = []): JsonResponse
    {
        return self::success([
            ...$extra,
            'paginate' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'data' => $resource::collection(collect($paginator->items())),
        ], $message);
    }

    /**
     * Menyusun struktur meta, data, dan success yang dipakai seluruh respons API.
     *
     * @param  mixed  $data
     * @param  ?string  $message
     * @param  int  $code
     * @param  string  $status
     * @param  bool  $success
     * @return array<string, mixed>
     */
    private static function envelope(mixed $data, ?string $message, int $code, string $status, bool $success): array
    {
        return [
            'meta' => [
                'code' => $code,
                'status' => $status,
                'message' => $message,
            ],
            'data' => $data,
            'success' => $success,
        ];
    }
}
