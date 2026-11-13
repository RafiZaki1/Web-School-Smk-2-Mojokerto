<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\AlumniServiceRequestRepositoryInterface;
use App\Contracts\Interfaces\AlumniServiceRequestServiceInterface;
use App\Contracts\Interfaces\DeviceNotificationRepositoryInterface;
use App\Enums\AlumniServiceStatusEnum;
use App\Models\AlumniServiceRequest;
use App\Models\DeviceNotification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

/**
 * Transaksi DB (>1 tabel: pengajuan + notifikasi) dipegang controller; service ini hanya
 * menyusun data dan memanggil repository.
 */
class AlumniServiceRequestService implements AlumniServiceRequestServiceInterface
{
    /** Kolom waktu yang diisi saat status pertama kali dicapai. */
    private const STATUS_TIMESTAMPS = [
        'processing' => 'processed_at',
        'approved' => 'approved_at',
        'completed' => 'completed_at',
    ];

    /**
     * Inisialisasi AlumniServiceRequestService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  AlumniServiceRequestRepositoryInterface  $requests
     * @param  DeviceNotificationRepositoryInterface  $notifications
     * @param  AlumniServiceNotificationComposer  $composer
     */
    public function __construct(
        protected AlumniServiceRequestRepositoryInterface $requests,
        protected DeviceNotificationRepositoryInterface $notifications,
        protected AlumniServiceNotificationComposer $composer,
    ) {}

    /**
     * Simpan pengajuan dari form publik beserta notifikasi "Pengajuan diterima" untuk perangkat pengaju.
     *
     * @param  array<string, mixed>  $data
     * @param  string  $deviceToken
     * @return AlumniServiceRequest
     */
    public function submit(array $data, string $deviceToken): AlumniServiceRequest
    {
        /** @var AlumniServiceRequest $request */
        $request = $this->requests->create([
            ...$data,
            'device_token' => $deviceToken,
            'status' => AlumniServiceStatusEnum::PENDING->value,
        ]);

        $this->notifications->store($this->composer->compose($request, AlumniServiceStatusEnum::PENDING));

        return $request;
    }

    /**
     * Ambil antrean kerja TU.
     *
     * @param  array<string, mixed>  $filters
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function queue(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->requests->paginateQueue($filters, $perPage);
    }

    /**
     * Ringkasan jumlah per status dan jumlah antrean terbuka per kelas.
     *
     * @return array{statuses: array<string, int>, open_by_class: array<string, int>}
     */
    public function summary(): array
    {
        return [
            'statuses' => $this->requests->statusCounts(),
            'open_by_class' => $this->requests->openCountsByClass(),
        ];
    }

    /**
     * Ambil pengajuan milik satu perangkat.
     *
     * @param  string  $deviceToken
     * @return Collection
     */
    public function forDevice(string $deviceToken): Collection
    {
        return $this->requests->forDevice($deviceToken);
    }

    /**
     * Terapkan perubahan dari tabel kerja TU. Perubahan status memakai update atomic, dan
     * notifikasi untuk perangkat pengaju hanya dibuat bila status benar-benar berubah.
     *
     * @param  array<string, mixed>  $data
     * @param  int  $id
     * @return array{request: AlumniServiceRequest, notification: DeviceNotification|null}
     */
    public function applyAdminChange(int $id, array $data): array
    {
        /** @var AlumniServiceRequest $request */
        $request = $this->requests->findOrFail($id);
        $notification = null;

        if (array_key_exists('admin_note', $data)) {
            $request = $this->requests->update($request, ['admin_note' => $data['admin_note']]);
        }

        $status = isset($data['status']) ? AlumniServiceStatusEnum::from($data['status']) : null;
        if ($status && $this->requests->changeStatus($id, $status->value, $this->timestampsFor($status, $request)) > 0) {
            /** @var AlumniServiceRequest $request */
            $request = $this->requests->findOrFail($id);
            $notification = $this->composer->shouldNotify($status)
                ? $this->notifications->store($this->composer->compose($request, $status))
                : null;
        }

        return ['request' => $request, 'notification' => $notification];
    }

    /**
     * Hapus pengajuan; notifikasinya ikut terhapus lewat foreign key cascade.
     *
     * @param  int  $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        return $this->requests->delete($this->requests->findOrFail($id));
    }

    /**
     * Isi kolom waktu untuk status baru bila belum pernah terisi.
     *
     * @param  AlumniServiceStatusEnum  $status
     * @param  AlumniServiceRequest  $request
     * @return array<string, Carbon>
     */
    private function timestampsFor(AlumniServiceStatusEnum $status, AlumniServiceRequest $request): array
    {
        $column = self::STATUS_TIMESTAMPS[$status->value] ?? null;

        return $column && ! $request->{$column} ? [$column => Carbon::now()] : [];
    }
}
