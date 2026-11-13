<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\MajorRepositoryInterface;
use App\Models\MajorQuizSubmission;
use Illuminate\Support\Collection;

class MajorQuizResultPresenter
{
    /**
     * Inisialisasi MajorQuizResultPresenter dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MajorRepositoryInterface $majorRepository,
    ) {}

    /**
     * Susun data hasil untuk halaman publik siswa, tanpa email dan catatan internal.
     *
     * @return array<string, mixed>
     */
    public function present(MajorQuizSubmission $submission): array
    {
        $majors = $this->majorRepository->published()->keyBy('slug');
        $scores = collect($submission->scores)->keyBy('slug');
        $resultSlug = $submission->resultMajor();
        $isCorrected = $submission->final_major && $submission->final_major !== $submission->recommended_major;
        $alternativeSlug = $submission->alternative_major !== $resultSlug ? $submission->alternative_major : null;

        return [
            'code' => $submission->code,
            'name' => $submission->name,
            'status' => $submission->status,
            'created_at' => $submission->created_at?->toISOString(),
            'created_label' => $submission->created_at?->locale('id')->translatedFormat('j F Y, H:i'),
            'reviewed_label' => $submission->reviewed_at?->locale('id')->translatedFormat('j F Y'),
            'total_answered' => $submission->total_answered,
            'analysis' => $isCorrected ? null : $submission->analysis,
            'is_corrected' => $isCorrected,
            'public_note' => $submission->public_note,
            'primary' => $this->scored($submission, $majors, $scores, $resultSlug),
            'system_recommendation' => $isCorrected ? $this->scored($submission, $majors, $scores, $submission->recommended_major, false) : null,
            'alternative' => $this->scored($submission, $majors, $scores, $alternativeSlug),
            'match_method' => $submission->match_method,
            'all_scores' => $this->allScores($submission, $scores),
            'answers' => collect($submission->answers)
                ->map(fn (array $answer) => collect($answer)->only(['question_id', 'question', 'answer'])->all())
                ->values()
                ->all(),
        ];
    }

    /**
     * Bentuk satu jurusan beserta persentase, alasan, bukti, dan rincian perhitungannya.
     *
     * @param  Collection<string, mixed>  $majors
     * @param  Collection<string, mixed>  $scores
     * @return array<string, mixed>|null
     */
    private function scored(MajorQuizSubmission $submission, Collection $majors, Collection $scores, ?string $slug, bool $detail = true): ?array
    {
        if (! $slug) {
            return null;
        }

        return [
            'major' => $detail ? $this->majorDetail($slug, $majors, $scores) : $this->majorSummary($slug, $scores),
            'percentage' => $scores[$slug]['percentage'] ?? 0,
            'reason' => $scores[$slug]['reason'] ?? null,
            'evidence' => $this->evidence($submission, $slug),
            ...$this->calculation($submission, $scores, $slug),
        ];
    }

    /**
     * Ambil seluruh skor jurusan beserta bukti dan rincian perhitungannya.
     *
     * @param  Collection<string, mixed>  $scores
     * @return array<int, array<string, mixed>>
     */
    private function allScores(MajorQuizSubmission $submission, Collection $scores): array
    {
        return collect($submission->scores)->map(fn (array $item) => [
            'major' => $this->majorSummary($item['slug'], $scores),
            'percentage' => $item['percentage'],
            'reason' => $item['reason'] ?? null,
            'evidence' => $this->evidence($submission, $item['slug']),
            ...$this->calculation($submission, $scores, $item['slug']),
        ])->values()->all();
    }

    /**
     * Id pertanyaan yang memberi poin untuk satu jurusan, sebagai bukti hasil.
     *
     * @return array<int, int|string>
     */
    private function evidence(MajorQuizSubmission $submission, string $slug): array
    {
        return collect($submission->answers)
            ->filter(fn (array $answer) => in_array($slug, $answer['majors'] ?? [], true))
            ->pluck('question_id')
            ->values()
            ->all();
    }

    /**
     * Rincian poin satu jurusan per jawaban yang memberi poin lebih dari nol.
     *
     * @return array<int, array<string, mixed>>
     */
    private function breakdown(MajorQuizSubmission $submission, string $slug): array
    {
        return collect($submission->answers)
            ->filter(fn (array $answer) => ($answer['points'][$slug] ?? 0) > 0)
            ->map(fn (array $answer) => [
                'question_id' => $answer['question_id'],
                'points' => $answer['points'][$slug],
                'weight' => $answer['weight'] ?? 1,
            ])
            ->values()
            ->all();
    }

    /**
     * Poin, poin maksimal, dan rincian untuk satu jurusan.
     *
     * @param  Collection<string, mixed>  $scores
     * @return array<string, mixed>
     */
    private function calculation(MajorQuizSubmission $submission, Collection $scores, string $slug): array
    {
        return [
            'points' => $scores[$slug]['points'] ?? null,
            'max_points' => $scores[$slug]['max_points'] ?? null,
            'breakdown' => $this->breakdown($submission, $slug),
        ];
    }

    /**
     * Ringkasan jurusan (kode dan nama) dari salinan skor, tetap ada walau jurusan sudah dihapus.
     *
     * @param  Collection<string, mixed>  $scores
     * @return array<string, string>
     */
    private function majorSummary(string $slug, Collection $scores): array
    {
        return [
            'slug' => $slug,
            'code' => $scores[$slug]['code'] ?? strtoupper($slug),
            'name' => $scores[$slug]['name'] ?? $slug,
        ];
    }

    /**
     * Detail jurusan untuk halaman hasil: tagline, gambar, alasan, dan prospek karier.
     *
     * @param  Collection<string, mixed>  $majors
     * @param  Collection<string, mixed>  $scores
     * @return array<string, mixed>
     */
    private function majorDetail(string $slug, Collection $majors, Collection $scores): array
    {
        $major = $majors[$slug] ?? null;
        $copy = config("major_quiz.majors.{$slug}", []);

        return [
            ...$this->majorSummary($slug, $scores),
            'tagline' => $major?->tagline,
            'image' => $major?->image,
            'why_match' => $copy['why_match'] ?? $major?->summary,
            'alternative_why_match' => $copy['alternative_why_match'] ?? $major?->summary,
            'careers' => collect($major?->careers ?? [])->pluck('title')->filter()->values()->all(),
        ];
    }
}
