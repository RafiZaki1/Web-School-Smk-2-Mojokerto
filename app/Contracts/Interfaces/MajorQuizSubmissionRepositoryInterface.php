<?php

namespace App\Contracts\Interfaces;

use App\Models\MajorQuizSubmission;

interface MajorQuizSubmissionRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Kontrak method findByCode.
     *
     * @param  string  $code
     * @return ?MajorQuizSubmission
     */
    public function findByCode(string $code): ?MajorQuizSubmission;

    /**
     * Kontrak method codeExists.
     *
     * @param  string  $code
     * @return bool
     */
    public function codeExists(string $code): bool;

    /**
     * Kontrak method countByStatus.
     *
     * @return array
     */
    public function countByStatus(): array;
}
