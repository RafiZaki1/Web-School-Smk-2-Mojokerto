<?php

namespace App\Services\LandingPage;

use Illuminate\Validation\ValidationException;

class MajorQuizAnswerResolver
{
    /**
     * Pasangkan jawaban dengan pertanyaan di config. Pertanyaan wajib harus diisi.
     *
     * @param  array<string, mixed>  $answers
     * @return array<int, array{question_id: int|string, question: string, answer: string, weight: int}>
     *
     * @throws ValidationException
     */
    public function resolve(array $answers): array
    {
        $resolved = [];
        $errors = [];

        foreach (config('major_quiz.questions') as $question) {
            $answer = $this->clean($answers[$question['id']] ?? null);

            if ($answer === null) {
                if ($question['required'] ?? true) {
                    $errors["answers.{$question['id']}"] = trans('alert.question_unanswered');
                }

                continue;
            }

            $resolved[] = [
                'question_id' => $question['id'],
                'question' => $question['question'],
                'answer' => mb_substr($answer, 0, config('major_quiz.answer_max_length')),
                'weight' => (int) ($question['weight'] ?? 1),
            ];
        }

        if ($errors) {
            throw ValidationException::withMessages($errors);
        }

        return $resolved;
    }

    /**
     * Simpan poin tiap jawaban (hanya yang lebih dari nol) dan jurusan yang memperolehnya.
     *
     * @param  array<int, array<string, mixed>>  $answers
     * @param  array<int, array<string, int>>  $answerPoints
     * @return array<int, array<string, mixed>>
     */
    public function withPoints(array $answers, array $answerPoints): array
    {
        return array_map(function (array $answer) use ($answerPoints) {
            $points = array_filter($answerPoints[$answer['question_id']] ?? []);
            arsort($points);

            return [...$answer, 'points' => $points, 'majors' => array_keys($points)];
        }, $answers);
    }

    /**
     * Bersihkan teks dari tag HTML dan spasi, mengembalikan null bila kosong.
     */
    public function clean(mixed $value): ?string
    {
        $text = trim(strip_tags((string) $value));

        return $text !== '' ? $text : null;
    }
}
