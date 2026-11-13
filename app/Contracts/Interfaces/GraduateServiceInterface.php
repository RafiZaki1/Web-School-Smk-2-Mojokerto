<?php

namespace App\Contracts\Interfaces;

use App\Models\Graduate;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Pengelolaan data siswa kelas XII oleh TU: CRUD satuan, arsip per tahun, dan Direktori Lulusan.
 */
interface GraduateServiceInterface
{
    /**
     * Kontrak method paginate.
     *
     * @param  array<string, mixed>  $filters
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function paginate(array $filters, int $perPage): LengthAwarePaginator;

    /**
     * Kontrak method find.
     *
     * @param  int|string  $id
     * @return Graduate
     */
    public function find(int|string $id): Graduate;

    /**
     * Kontrak method create.
     *
     * @param  array<string, mixed>  $data
     * @return Graduate
     */
    public function create(array $data): Graduate;

    /**
     * Kontrak method update.
     *
     * @param  array<string, mixed>  $data
     * @param  int|string  $id
     * @return Graduate
     */
    public function update(int|string $id, array $data): Graduate;

    /**
     * Kontrak method delete.
     *
     * @param  int|string  $id
     * @return bool
     */
    public function delete(int|string $id): bool;

    /**
     * Kontrak method years.
     *
     * @return array<int, array{year: int, active: int, archived: int}>
     */
    public function years(): array;

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
}
