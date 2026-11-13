<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\MajorQuizMatcherInterface;
use App\Contracts\Interfaces\MajorQuizServiceInterface;
use App\Contracts\Interfaces\MajorQuizSubmissionRepositoryInterface;
use App\Contracts\Interfaces\MajorRepositoryInterface;
use App\Enums\MajorQuizStatusEnum;
use App\Models\MajorQuizSubmission;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class MajorQuizService implements MajorQuizServiceInterface
{
    /** Tanpa huruf/angka yang mirip (0/O, 1/I/L) supaya kode mudah diketik ulang. */
    protected const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    /** @var int */
    protected const CODE_LENGTH = 8;

    /**
     * Inisialisasi MajorQuizService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MajorRepositoryInterface $majorRepository,
        protected MajorQuizSubmissionRepositoryInterface $submissions,
        protected MajorQuizMatcherInterface $matcher,
        protected MajorQuizScorer $scorer,
        protected MajorQuizResultPresenter $presenter,
        protected MajorQuizAnswerResolver $answers,
    ) {}

    /**
     * Ambil daftar soal kuis beserta pengaturan tampilannya.
     *
     * @return array<string, mixed>
     */
    public function getQuestions(): array
    {
        $questions = array_map(fn (array $question) => [
            'id' => $question['id'],
            'question' => $question['question'],
            'hint' => $question['hint'] ?? null,
            'required' => (bool) ($question['required'] ?? true),
        ], config('major_quiz.questions'));

        return [
            'total' => count($questions),
            'estimated_minutes' => config('major_quiz.estimated_minutes'),
            'answer_max_length' => config('major_quiz.answer_max_length'),
            'questions' => $questions,
        ];
    }

    /**
     * Cocokkan jawaban teks bebas (id pertanyaan => jawaban) dengan jurusan lalu simpan sebagai log.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws ValidationException
     */
    public function submit(array $data): MajorQuizSubmission
    {
        $majors = $this->majorRepository->published();

        if ($majors->isEmpty()) {
            throw ValidationException::withMessages(['answers' => trans('alert.major_data_unavailable')]);
        }

        $answers = $this->answers->resolve($data['answers'] ?? []);
        $match = $this->matcher->match($answers, $majors);
        $scores = $this->scorer->rank($match['answer_points'], $match['reasons'] ?? [], $answers, $majors);

        $alternative = $scores[1] ?? null;
        $hasAlternative = $alternative
            && $alternative['percentage'] > 0
            && $alternative['percentage'] >= config('major_quiz.alternative_min_percentage');

        return $this->submissions->create([
            'code' => $this->generateCode(),
            'name' => $this->answers->clean($data['name'] ?? null),
            'email' => ($email = $this->answers->clean($data['email'] ?? null)) ? strtolower($email) : null,
            'answers' => $this->answers->withPoints($answers, $match['answer_points']),
            'scores' => $scores,
            'total_answered' => count($answers),
            'analysis' => $match['analysis'],
            'match_method' => $match['method'],
            'recommended_major' => $scores[0]['slug'],
            'alternative_major' => $hasAlternative ? $alternative['slug'] : null,
            'status' => MajorQuizStatusEnum::NEW->value,
        ]);
    }

    /**
     * Cari hasil kuis berdasarkan kode, atau gagal dengan ModelNotFoundException.
     */
    public function findByCodeOrFail(string $code): MajorQuizSubmission
    {
        return $this->submissions->findByCode($code)
            ?? throw (new ModelNotFoundException)->setModel(MajorQuizSubmission::class, [$code]);
    }

    /**
     * Data hasil untuk halaman publik siswa, tanpa email dan catatan internal.
     *
     * @return array<string, mixed>
     */
    public function publicResult(MajorQuizSubmission $submission): array
    {
        return $this->presenter->present($submission);
    }

    /**
     * Ambil seluruh log kuis untuk admin.
     */
    public function getAll(): Collection
    {
        return $this->submissions->all();
    }

    /**
     * Ambil log kuis berdasarkan id, atau gagal.
     */
    public function getById(int|string $id): MajorQuizSubmission
    {
        return $this->submissions->findOrFail($id);
    }

    /**
     * Koreksi admin: jurusan akhir, catatan untuk siswa, dan catatan internal.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws ValidationException
     */
    public function review(int|string $id, array $data): MajorQuizSubmission
    {
        $submission = $this->getById($id);
        $finalMajor = $data['final_major'] ?? null;

        if ($finalMajor && ! collect($submission->scores)->contains('slug', $finalMajor)) {
            throw ValidationException::withMessages(['final_major' => trans('alert.unknown_major')]);
        }

        return $this->submissions->update($submission, [
            'final_major' => $finalMajor === $submission->recommended_major ? null : $finalMajor,
            'public_note' => $data['public_note'] ?? null,
            'admin_note' => $data['admin_note'] ?? null,
            'status' => MajorQuizStatusEnum::REVIEWED->value,
            'reviewed_at' => now(),
        ]);
    }

    /**
     * Hapus log kuis.
     */
    public function delete(int|string $id): bool
    {
        return $this->submissions->delete($this->getById($id));
    }

    /**
     * Hitung jumlah log kuis per status.
     *
     * @return array<string, int>
     */
    public function statusCounts(): array
    {
        return $this->submissions->countByStatus();
    }

    /**
     * Buat kode hasil kuis yang unik dari alfabet tanpa karakter yang mirip.
     */
    protected function generateCode(): string
    {
        do {
            $code = collect(range(1, self::CODE_LENGTH))
                ->map(fn () => self::CODE_ALPHABET[random_int(0, strlen(self::CODE_ALPHABET) - 1)])
                ->join('');
        } while ($this->submissions->codeExists($code));

        return $code;
    }
}
