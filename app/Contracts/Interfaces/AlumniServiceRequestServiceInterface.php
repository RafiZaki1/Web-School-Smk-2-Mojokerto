<?php

namespace App\Contracts\Interfaces;

use App\Models\AlumniServiceRequest;
use App\Models\DeviceNotification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Pengajuan layanan berkas alumni dari form publik dan pemrosesannya oleh TU.
 */
interface AlumniServiceRequestServiceInterface
{
    /**
     * Kontrak method submit.
     *
     * @param  array<string, mixed>  $data
     * @param  string  $deviceToken
     * @return AlumniServiceRequest
     */
    public function submit(array $data, string $deviceToken): AlumniServiceRequest;

    /**
     * Kontrak method queue.
     *
     * @param  array<string, mixed>  $filters
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function queue(array $filters, int $perPage): LengthAwarePaginator;

    /**
     * Kontrak method summary.
     *
     * @return array{statuses: array<string, int>, open_by_class: array<string, int>}
     */
    public function summary(): array;

    /**
     * Kontrak method forDevice.
     *
     * @param  string  $deviceToken
     * @return Collection
     */
    public function forDevice(string $deviceToken): Collection;

    /**
     * Kontrak method applyAdminChange.
     *
     * @param  array<string, mixed>  $data
     * @param  int  $id
     * @return array{request: AlumniServiceRequest, notification: DeviceNotification|null}
     */
    public function applyAdminChange(int $id, array $data): array;

    /**
     * Kontrak method delete.
     *
     * @param  int  $id
     * @return bool
     */
    public function delete(int $id): bool;
}
