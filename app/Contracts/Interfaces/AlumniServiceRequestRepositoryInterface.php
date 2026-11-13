<?php

namespace App\Contracts\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Antrean layanan berkas alumni (ambil ijazah, cap tiga jari, legalisir).
 */
interface AlumniServiceRequestRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Kontrak method paginateQueue.
     *
     * @param  array<string, mixed>  $filters
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function paginateQueue(array $filters, int $perPage): LengthAwarePaginator;

    /**
     * Kontrak method forDevice.
     *
     * @param  string  $deviceToken
     * @return Collection
     */
    public function forDevice(string $deviceToken): Collection;

    /**
     * Kontrak method changeStatus.
     *
     * @param  array<string, mixed>  $extra
     * @param  int  $id
     * @param  string  $status
     * @return int
     */
    public function changeStatus(int $id, string $status, array $extra = []): int;

    /**
     * Kontrak method statusCounts.
     *
     * @return array<string, int>
     */
    public function statusCounts(): array;

    /**
     * Kontrak method openCountsByClass.
     *
     * @return array<string, int>
     */
    public function openCountsByClass(): array;
}
