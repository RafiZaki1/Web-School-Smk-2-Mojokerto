<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\AlumniServiceRequestRepositoryInterface;
use App\Enums\AlumniServiceStatusEnum;
use App\Models\AlumniServiceRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class AlumniServiceRequestRepository extends BaseRepository implements AlumniServiceRequestRepositoryInterface
{
    /** @var class-string<AlumniServiceRequest> */
    protected string $model = AlumniServiceRequest::class;

    /**
     * Ambil antrean kerja TU dengan filter kelas, jurusan, status, jenis layanan, dan pencarian.
     *
     * @param  array<string, mixed>  $filters
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function paginateQueue(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->query()
            ->forClass($filters['class'] ?? null)
            ->forMajor($filters['major'] ?? null)
            ->status($filters['status'] ?? null)
            ->when($filters['type'] ?? null, fn (Builder $q, $type) => $q->where('service_type', $type))
            ->when($filters['search'] ?? null, fn (Builder $q, $search) => $q->where(fn (Builder $inner) => $inner
                ->where('full_name', 'like', '%'.trim($search).'%')
                ->orWhere('nisn', 'like', trim($search).'%')
                ->orWhere('ticket_code', trim($search))))
            ->queue()
            ->paginate($perPage);
    }

    /**
     * Ambil pengajuan milik satu perangkat, terbaru lebih dulu.
     *
     * @param  string  $deviceToken
     * @return Collection
     */
    public function forDevice(string $deviceToken): Collection
    {
        return $this->query()->forDevice($deviceToken)->latest('id')->limit(20)->get();
    }

    /**
     * Ubah status secara atomic hanya bila statusnya memang berbeda, agar dua perangkat TU
     * yang menyimpan bersamaan tidak memicu notifikasi ganda.
     *
     * @param  array<string, mixed>  $extra
     * @param  int  $id
     * @param  string  $status
     * @return int 0 = status sudah sama / data tidak ditemukan
     */
    public function changeStatus(int $id, string $status, array $extra = []): int
    {
        return $this->query()
            ->whereKey($id)
            ->where('status', '!=', $status)
            ->update([...$extra, 'status' => $status, 'updated_at' => Carbon::now()]);
    }

    /**
     * Jumlah pengajuan per status.
     *
     * @return array<string, int>
     */
    public function statusCounts(): array
    {
        $counts = $this->query()->selectRaw('status, COUNT(*) AS total')->groupBy('status')->pluck('total', 'status');

        return collect(AlumniServiceStatusEnum::values())->mapWithKeys(fn (string $status) => [$status => (int) ($counts[$status] ?? 0)])->all();
    }

    /**
     * Jumlah pengajuan yang belum selesai (menunggu dan diproses) per kelas, untuk penanda filter 12 kelas.
     *
     * @return array<string, int>
     */
    public function openCountsByClass(): array
    {
        return $this->query()
            ->selectRaw('class_name, COUNT(*) AS total')
            ->whereIn('status', [AlumniServiceStatusEnum::PENDING->value, AlumniServiceStatusEnum::PROCESSING->value])
            ->groupBy('class_name')
            ->pluck('total', 'class_name')
            ->map(fn ($total) => (int) $total)
            ->all();
    }
}
