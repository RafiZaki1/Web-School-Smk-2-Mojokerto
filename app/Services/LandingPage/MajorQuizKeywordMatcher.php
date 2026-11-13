<?php

namespace App\Services\LandingPage;

use App\Models\Major;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class MajorQuizKeywordMatcher
{
    /**
     * Hitung poin per jawaban dari kata kunci: 2 bila ada dua kata atau lebih yang cocok, 1 bila ada satu.
     *
     * @param  array<int, array<string, mixed>>  $answers
     * @param  Collection<int, Major>  $majors
     * @return array<string, mixed>
     */
    public function match(array $answers, Collection $majors): array
    {
        $slugs = $majors->pluck('slug')->all();
        $foundWords = array_fill_keys($slugs, []);
        $answerPoints = [];

        foreach ($answers as $answer) {
            $text = Str::lower($answer['answer']);

            foreach ($slugs as $slug) {
                $words = $this->keywordsIn($text, $slug);

                $answerPoints[$answer['question_id']][$slug] = min(2, $words->count());
                $foundWords[$slug] = array_unique([...$foundWords[$slug], ...$words->all()]);
            }
        }

        $anyMatch = collect($answerPoints)->flatten()->sum() > 0;

        return [
            'method' => 'keyword',
            'answer_points' => $answerPoints,
            'reasons' => $this->reasons($majors, $foundWords),
            'analysis' => $anyMatch ? null : 'Jawabanmu belum banyak menyebut minat yang spesifik, jadi hasil ini akan ditinjau langsung oleh guru BK.',
        ];
    }

    /**
     * Cari kata kunci sebuah jurusan yang muncul di teks. Kata pendek dicocokkan utuh, kata panjang boleh berimbuhan.
     *
     * @return Collection<int, string>
     */
    private function keywordsIn(string $text, string $slug): Collection
    {
        return collect(config("major_quiz.majors.{$slug}.keywords", []))
            ->filter(fn (string $word) => preg_match('/\b'.preg_quote($word, '/').(mb_strlen($word) <= 3 ? '\b' : '').'/u', $text))
            ->values();
    }

    /**
     * Susun satu kalimat alasan per jurusan dari kata kunci yang ditemukan.
     *
     * @param  Collection<int, Major>  $majors
     * @param  array<string, array<int, string>>  $foundWords
     * @return array<string, string>
     */
    private function reasons(Collection $majors, array $foundWords): array
    {
        return $majors->mapWithKeys(fn (Major $major) => [
            $major->slug => $foundWords[$major->slug]
                ? 'Jawabanmu menyebut kata seperti '.collect($foundWords[$major->slug])->take(4)->map(fn ($word) => "“{$word}”")->join(', ', ' dan ')." yang berkaitan dengan {$major->code}."
                : "Belum ada jawabanmu yang menyinggung bidang {$major->code}.",
        ])->all();
    }
}
