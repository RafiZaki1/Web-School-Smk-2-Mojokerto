<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\MajorQuizSubmissionRepositoryInterface;
use App\Enums\MajorQuizStatusEnum;
use App\Models\MajorQuizSubmission;
use Illuminate\Database\Eloquent\Builder;

class MajorQuizSubmissionRepository extends BaseRepository implements MajorQuizSubmissionRepositoryInterface
{
    /** @var class-string<MajorQuizSubmission> */
    protected string $model = MajorQuizSubmission::class;

    /**
     * Urutkan log kuis dari yang terbaru dibuat.
     */
    protected function ordered(Builder $query): Builder
    {
        return $query->latestFirst();
    }

    /**
     * Cari hasil kuis berdasarkan kode unik yang diberikan ke siswa.
     */
    public function findByCode(string $code): ?MajorQuizSubmission
    {
        return $this->query()->where('code', strtoupper($code))->first();
    }

    /**
     * Periksa apakah kode kuis sudah dipakai.
     */
    public function codeExists(string $code): bool
    {
        return $this->query()->where('code', $code)->exists();
    }

    /**
     * Hitung jumlah log kuis untuk setiap status, termasuk status yang bernilai nol.
     *
     * @return array<string, int>
     */
    public function countByStatus(): array
    {
        $counts = $this->query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return collect(MajorQuizStatusEnum::values())
            ->mapWithKeys(fn (string $status) => [$status => (int) ($counts[$status] ?? 0)])
            ->all();
    }
}
