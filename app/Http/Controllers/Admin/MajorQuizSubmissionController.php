<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\MajorQuizServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewMajorQuizRequest;
use App\Http\Resources\MajorQuizSubmissionResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class MajorQuizSubmissionController extends Controller
{
    /**
     * Inisialisasi MajorQuizSubmissionController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  MajorQuizServiceInterface  $quizService
     */
    public function __construct(
        protected MajorQuizServiceInterface $quizService
    ) {}

    /**
     * Tampilkan log kuis jurusan beserta jumlah per status.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            return ResponseHelper::success([
                'counts' => $this->quizService->statusCounts(),
                'items' => MajorQuizSubmissionResource::collection($this->quizService->getAll()),
            ], trans('alert.fetch_success', ['resource' => 'Log kuis jurusan']));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tampilkan satu log kuis jurusan.
     *
     * @param  string  $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new MajorQuizSubmissionResource($this->quizService->getById($id)),
                trans('alert.fetch_success', ['resource' => 'Log kuis jurusan'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tinjau hasil kuis: koreksi jurusan akhir dan catatan.
     *
     * @param  ReviewMajorQuizRequest  $request
     * @param  string  $id
     * @return JsonResponse
     */
    public function update(ReviewMajorQuizRequest $request, string $id): JsonResponse
    {
        try {
            return ResponseHelper::success(
                new MajorQuizSubmissionResource($this->quizService->review($id, $request->validated())),
                trans('alert.update_success', ['resource' => 'Hasil kuis'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus log kuis jurusan.
     *
     * @param  string  $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->quizService->delete($id);

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => 'Log kuis jurusan']));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
