<?php

namespace App\Contracts\Interfaces;

use App\Models\MajorQuizSubmission;
use Illuminate\Database\Eloquent\Collection;

interface MajorQuizServiceInterface
{
    /**
     * Kontrak method getQuestions.
     *
     * @return array
     */
    public function getQuestions(): array;

    /**
     * Kontrak method submit.
     *
     * @param  array  $data
     * @return MajorQuizSubmission
     */
    public function submit(array $data): MajorQuizSubmission;

    /**
     * Kontrak method findByCodeOrFail.
     *
     * @param  string  $code
     * @return MajorQuizSubmission
     */
    public function findByCodeOrFail(string $code): MajorQuizSubmission;

    /**
     * Kontrak method publicResult.
     *
     * @param  MajorQuizSubmission  $submission
     * @return array
     */
    public function publicResult(MajorQuizSubmission $submission): array;

    /**
     * Kontrak method getAll.
     *
     * @return Collection
     */
    public function getAll(): Collection;

    /**
     * Kontrak method getById.
     *
     * @param  int|string  $id
     * @return MajorQuizSubmission
     */
    public function getById(int|string $id): MajorQuizSubmission;

    /**
     * Kontrak method review.
     *
     * @param  int|string  $id
     * @param  array  $data
     * @return MajorQuizSubmission
     */
    public function review(int|string $id, array $data): MajorQuizSubmission;

    /**
     * Kontrak method delete.
     *
     * @param  int|string  $id
     * @return bool
     */
    public function delete(int|string $id): bool;

    /**
     * Kontrak method statusCounts.
     *
     * @return array
     */
    public function statusCounts(): array;
}
