<?php

namespace App\Services\LandingPage;

use App\Models\Major;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class MajorQuizAiParser
{
    /**
     * Validasi JSON dari AI dan ubah menjadi hasil pencocokan. Mengembalikan null bila bentuknya tidak bisa dipercaya.
     *
     * @param  array<int, array<string, mixed>>  $answers
     * @param  Collection<int, Major>  $majors
     * @return array<string, mixed>|null
     */
    public function parse(string $raw, array $answers, Collection $majors): ?array
    {
        $json = json_decode(trim(preg_replace('/^```(?:json)?|```$/m', '', $raw)), true);

        if (! is_array($json) || ! is_array($json['answer_points'] ?? null)) {
            return null;
        }

        $slugs = $majors->pluck('slug')->all();
        $analysis = trim(strip_tags((string) ($json['analysis'] ?? '')));

        return [
            'method' => 'ai',
            'answer_points' => $this->answerPoints($json['answer_points'], $answers, $slugs),
            'reasons' => $this->reasons($json['reasons'] ?? [], $slugs),
            'analysis' => $analysis !== '' ? Str::limit($analysis, 800) : null,
        ];
    }

    /**
     * Ambil skor 0 sampai 2 untuk setiap jurusan pada setiap pertanyaan. Angka polos dan bentuk objek sama-sama diterima.
     *
     * @param  array<string, mixed>  $answerPoints
     * @param  array<int, array<string, mixed>>  $answers
     * @param  array<int, string>  $slugs
     * @return array<int|string, array<string, int>>
     */
    private function answerPoints(array $answerPoints, array $answers, array $slugs): array
    {
        $points = [];

        foreach ($answers as $answer) {
            $raw = $answerPoints[$answer['question_id']] ?? $answerPoints[(string) $answer['question_id']] ?? [];

            $points[$answer['question_id']] = collect($slugs)
                ->mapWithKeys(function (string $slug) use ($raw) {
                    $score = is_array($raw) ? ($raw[$slug] ?? 0) : 0;
                    $score = is_array($score) ? ($score['skor'] ?? 0) : $score;

                    return [$slug => (int) max(0, min(2, round((float) $score)))];
                })
                ->all();
        }

        return $points;
    }

    /**
     * Ambil satu kalimat alasan per jurusan, dibersihkan dari HTML dan dipotong bila terlalu panjang.
     *
     * @param  array<string, mixed>  $reasons
     * @param  array<int, string>  $slugs
     * @return array<string, string|null>
     */
    private function reasons(array $reasons, array $slugs): array
    {
        return collect($slugs)
            ->mapWithKeys(fn (string $slug) => [$slug => Str::limit(trim(strip_tags((string) ($reasons[$slug] ?? ''))), 300) ?: null])
            ->all();
    }
}
