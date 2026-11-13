<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\MajorQuizMatcherInterface;
use App\Models\Major;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

class MajorQuizMatcher implements MajorQuizMatcherInterface
{
    /**
     * Inisialisasi MajorQuizMatcher dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected AiUsageLimiter $aiUsage,
        protected MajorQuizAiPromptBuilder $prompts,
        protected MajorQuizAiClient $client,
        protected MajorQuizAiParser $parser,
        protected MajorQuizKeywordMatcher $keywords,
    ) {}

    /**
     * Cocokkan jawaban dengan jurusan. Memakai AI bila diaktifkan dan kuota harian tersedia, selain itu kata kunci.
     *
     * @param  array<int, array<string, mixed>>  $answers
     * @param  Collection<int, Major>  $majors
     * @return array<string, mixed>
     */
    public function match(array $answers, Collection $majors): array
    {
        if (config('major_quiz.use_ai') && $this->aiUsage->allow('major_quiz', null, null, config('major_quiz.daily_limit_total')) === null) {
            $result = $this->matchWithAi($answers, $majors);

            if ($result) {
                return $result;
            }
        }

        return $this->keywords->match($answers, $majors);
    }

    /**
     * Minta penilaian AI. Galat apa pun dicatat sebagai peringatan lalu dikembalikan null agar kata kunci dipakai.
     *
     * @param  array<int, array<string, mixed>>  $answers
     * @param  Collection<int, Major>  $majors
     * @return array<string, mixed>|null
     */
    private function matchWithAi(array $answers, Collection $majors): ?array
    {
        try {
            $raw = $this->client->send($this->prompts->system($majors), $this->prompts->user($answers));

            return $raw ? $this->parser->parse($raw, $answers, $majors) : null;
        } catch (Throwable $e) {
            Log::warning('MajorQuizMatcher AI gagal: '.$e->getMessage());

            return null;
        }
    }
}
