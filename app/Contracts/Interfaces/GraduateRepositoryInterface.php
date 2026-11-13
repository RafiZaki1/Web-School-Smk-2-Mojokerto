<?php

namespace App\Contracts\Interfaces;

use App\Models\Graduate;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Data kelulusan siswa kelas XII dan arsip Direktori Lulusan.
 */
interface GraduateRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Kontrak method paginateForAdmin.
     *
     * @param  array<string, mixed>  $filters
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function paginateForAdmin(array $filters, int $perPage): LengthAwarePaginator;

    /**
     * Kontrak method findForCheck.
     *
     * @param  string  $nisn
     * @param  string  $fullName
     * @param  int  $year
     * @return ?Graduate
     */
    public function findForCheck(string $nisn, string $fullName, int $year): ?Graduate;

    /**
     * Kontrak method nisnExists.
     *
     * @param  string  $nisn
     * @param  ?int  $ignoreId
     * @return bool
     */
    public function nisnExists(string $nisn, ?int $ignoreId = null): bool;

    /**
     * Kontrak method existingNisns.
     *
     * @param  array<int, string>  $nisns
     * @return array<int, string>
     */
    public function existingNisns(array $nisns): array;

    /**
     * Kontrak method upsertByNisn.
     *
     * @param  array<int, array<string, mixed>>  $rows
     * @return int
     */
    public function upsertByNisn(array $rows): int;

    /**
     * Kontrak method yearSummaries.
     *
     * @return array<int, array{year: int, active: int, archived: int}>
     */
    public function yearSummaries(): array;

    /**
     * Kontrak method statusSummary.
     *
     * @param  int  $year
     * @return array{total: int, passed: int, deferred: int, administration_pending: int}
     */
    public function statusSummary(int $year): array;

    /**
     * Kontrak method archiveYear.
     *
     * @param  int  $year
     * @return int
     */
    public function archiveYear(int $year): int;

    /**
     * Kontrak method deleteYear.
     *
     * @param  int  $year
     * @return int
     */
    public function deleteYear(int $year): int;

    /**
     * Kontrak method rosterActiveYear.
     *
     * @param  int  $year
     * @return Collection
     */
    public function rosterActiveYear(int $year): Collection;
}
