<?php

namespace App\Http\Requests;

/**
 * Body callback Tripay (event payment_status). Signature sudah divalidasi middleware tripay.signature.
 */
class TripayCallbackRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi callback Tripay.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'reference' => ['required', 'string', 'max:64'],
            'merchant_ref' => ['required', 'string', 'max:64'],
            'status' => ['required', 'string', 'max:20'],
            'total_amount' => ['required', 'integer', 'min:0'],
            'payment_method' => ['nullable', 'string', 'max:100'],
            'payment_method_code' => ['nullable', 'string', 'max:30'],
            'paid_at' => ['nullable', 'integer'],
        ];
    }

    /**
     * Ambil pesan galat kustom untuk setiap aturan validasi.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'reference.required' => 'reference wajib ada.',
            'reference.string' => 'reference harus berupa teks.',
            'reference.max' => 'reference maksimal :max karakter.',
            'merchant_ref.required' => 'merchant_ref wajib ada.',
            'merchant_ref.string' => 'merchant_ref harus berupa teks.',
            'merchant_ref.max' => 'merchant_ref maksimal :max karakter.',
            'status.required' => 'status wajib ada.',
            'status.string' => 'status harus berupa teks.',
            'status.max' => 'status maksimal :max karakter.',
            'total_amount.required' => 'total_amount wajib ada.',
            'total_amount.integer' => 'total_amount harus berupa angka.',
            'total_amount.min' => 'total_amount minimal :min.',
            'payment_method.string' => 'payment_method harus berupa teks.',
            'payment_method.max' => 'payment_method maksimal :max karakter.',
            'payment_method_code.string' => 'payment_method_code harus berupa teks.',
            'payment_method_code.max' => 'payment_method_code maksimal :max karakter.',
            'paid_at.integer' => 'paid_at harus berupa timestamp.',
        ];
    }
}
