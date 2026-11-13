<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\MajorQuizServiceInterface;
use App\Exceptions\RequestBlockedException;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitMajorQuizRequest;
use App\Services\LandingPage\AiUsageLimiter;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class MajorQuizController extends Controller
{
    /**
     * Inisialisasi MajorQuizController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MajorQuizServiceInterface $quizService,
        protected AiUsageLimiter $aiUsage
    ) {}

    /**
     * Tampilkan soal kuis minat jurusan.
     */
    public function questions(): JsonResponse
    {
        return ResponseHelper::success(
            $this->quizService->getQuestions(),
            trans('alert.fetch_success', ['resource' => 'Soal kuis jurusan'])
        );
    }

    /**
     * Simpan jawaban kuis dan langsung kembalikan hasil pencocokan jurusan.
     */
    public function submit(SubmitMajorQuizRequest $request): JsonResponse
    {
        try {
            if ($this->aiUsage->allow('major_quiz', $request->ip(), config('major_quiz.daily_limit_per_ip'), null) === 'ip') {
                throw new RequestBlockedException(
                    trans('alert.quiz_daily_ip'),
                    Response::HTTP_TOO_MANY_REQUESTS,
                    ['retry_after' => now()->diffInSeconds(now()->endOfDay())]
                );
            }

            $submission = $this->quizService->submit($request->validated());

            return ResponseHelper::success(
                $this->quizService->publicResult($submission),
                trans('alert.quiz_submitted'),
                Response::HTTP_CREATED
            );
        } catch (RequestBlockedException $th) {
            return ResponseHelper::error($th->data(), $th->getMessage(), $th->statusCode());
        } catch (ValidationException $th) {
            throw $th;
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Buka kembali hasil kuis menggunakan kode yang diterima siswa.
     */
    public function show(string $code): JsonResponse
    {
        return ResponseHelper::success(
            $this->quizService->publicResult($this->quizService->findByCodeOrFail($code)),
            trans('alert.fetch_success', ['resource' => 'Hasil kuis'])
        );
    }
}
