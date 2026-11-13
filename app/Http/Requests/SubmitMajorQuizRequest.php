<?php

namespace App\Http\Requests;

class SubmitMajorQuizRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi jawaban kuis minat jurusan. Nama dan email bersifat opsional.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:100'],
            'email' => ['nullable', 'string', 'email:rfc', 'max:150'],
            'answers' => ['required', 'array', 'max:20'],
            'answers.*' => ['nullable', 'string', 'max:'.config('major_quiz.answer_max_length')],
            'website' => ['prohibited'],
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
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 100 karakter.',
            'email.string' => 'Email harus berupa teks.',
            'email.email' => 'Masukkan alamat email yang valid.',
            'email.max' => 'Email maksimal 150 karakter.',
            'answers.required' => 'Jawab pertanyaannya terlebih dahulu.',
            'answers.array' => 'Jawaban harus berupa daftar.',
            'answers.max' => 'Jawaban maksimal :max item.',
            'answers.*.string' => 'Setiap jawaban harus berupa teks.',
            'answers.*.max' => 'Jawaban maksimal :max karakter.',
            'website.prohibited' => 'Permintaan tidak valid terdeteksi.',
        ];
    }
}
