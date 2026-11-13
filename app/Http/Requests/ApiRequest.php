<?php

namespace App\Http\Requests;

use App\Helpers\ResponseHelper;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

abstract class ApiRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna boleh mengirim request ini.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Ambil aturan validasi yang berlaku untuk request.
     *
     * @return array<string, mixed>
     */
    abstract public function rules(): array;

    /**
     * Ubah galat validasi menjadi respons JSON standar dengan status 422.
     */
    protected function failedValidation(Validator $validator): void
    {
        ResponseHelper::error(
            $validator->errors()->messages(),
            trans('alert.validation_failed'),
            Response::HTTP_UNPROCESSABLE_ENTITY
        );
    }

    /**
     * Ubah penolakan otorisasi menjadi respons JSON standar dengan status 403.
     */
    protected function failedAuthorization(): void
    {
        ResponseHelper::error(null, trans('alert.forbidden'), Response::HTTP_FORBIDDEN);
    }
}
