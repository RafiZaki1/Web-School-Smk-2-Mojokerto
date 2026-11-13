<?php

namespace App\Services\LandingPage;

use App\Models\Major;
use Illuminate\Support\Collection;

class MajorQuizScorer
{
    /** Poin satu jawaban untuk satu jurusan: 2 = sangat berkaitan, 1 = sedikit, 0 = tidak. */
    protected const MAX_POINTS_PER_ANSWER = 2;

    /**
     * Beri peringkat jurusan dengan skor berbobot. Persentase dihitung dari total poin dibagi poin maksimal.
     * Diurutkan dari persentase tertinggi; seri mengikuti urutan jurusan.
     *
     * @param  array<int, array<string, int>>  $answerPoints  poin per id pertanyaan lalu per jurusan
     * @param  array<string, string|null>  $reasons
     * @param  array<int, array<string, mixed>>  $answers
     * @param  Collection<int, Major>  $majors
     * @return array<int, array<string, mixed>>
     */
    public function rank(array $answerPoints, array $reasons, array $answers, Collection $majors): array
    {
        $maxPoints = max(1, collect($answers)->sum(fn (array $answer) => self::MAX_POINTS_PER_ANSWER * ($answer['weight'] ?? 1)));

        return $majors
            ->map(function (Major $major) use ($answerPoints, $reasons, $answers, $maxPoints) {
                $points = $this->pointsFor($major->slug, $answerPoints, $answers);

                return [
                    'slug' => $major->slug,
                    'code' => $major->code,
                    'name' => $major->name,
                    'points' => $points,
                    'max_points' => $maxPoints,
                    'percentage' => (int) round($points / $maxPoints * 100),
                    'reason' => $reasons[$major->slug] ?? null,
                ];
            })
            ->sortByDesc('percentage')
            ->values()
            ->all();
    }

    /**
     * Jumlahkan poin berbobot satu jurusan dari seluruh jawaban.
     *
     * @param  array<int, array<string, int>>  $answerPoints
     * @param  array<int, array<string, mixed>>  $answers
     */
    private function pointsFor(string $slug, array $answerPoints, array $answers): int
    {
        return collect($answers)->sum(fn (array $answer) => ($answerPoints[$answer['question_id']][$slug] ?? 0) * ($answer['weight'] ?? 1));
    }
}
