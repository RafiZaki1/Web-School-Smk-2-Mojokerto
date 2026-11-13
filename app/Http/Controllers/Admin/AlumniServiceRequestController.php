<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\AlumniServiceRequestServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAlumniServiceRequest;
use App\Http\Resources\AlumniServiceRequestResource;
use App\Jobs\SendDeviceNotificationJob;
use App\Services\SchoolAdministration\AlumniServiceNotificationComposer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Tabel kerja layanan alumni. Satu akun TU bisa dibuka di banyak perangkat sekaligus;
 * tiap perubahan disimpan per kolom (auto-save) dan perangkat lain menarik data lewat polling.
 */
class AlumniServiceRequestController extends Controller
{
    private const LABEL = 'Layanan alumni';

    private const FILTERS = ['class', 'major', 'status', 'type', 'search'];

    /**
     * Inisialisasi AlumniServiceRequestController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  AlumniServiceRequestServiceInterface  $service
     * @param  AlumniServiceNotificationComposer  $composer
     */
    public function __construct(
        protected AlumniServiceRequestServiceInterface $service,
        protected AlumniServiceNotificationComposer $composer,
    ) {}

    /**
     * Tampilkan antrean per halaman beserta ringkasan status dan jumlah antrean per kelas.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = array_filter($request->only(self::FILTERS), fn ($value) => is_string($value) && $value !== '');
        $perPage = min(100, max(10, (int) $request->query('per_page', 50)));

        return ResponseHelper::paginate(
            $this->service->queue($filters, $perPage),
            AlumniServiceRequestResource::class,
            trans('alert.fetch_success', ['resource' => self::LABEL]),
            ['summary' => $this->service->summary()],
        );
    }

    /**
     * Simpan perubahan status atau catatan. Perubahan status menulis ke tabel pengajuan dan
     * notifikasi sekaligus, jadi dibungkus transaksi; Web Push dikirim setelah commit.
     *
     * @param  UpdateAlumniServiceRequest  $request
     * @param  string  $id
     * @return JsonResponse
     */
    public function update(UpdateAlumniServiceRequest $request, string $id): JsonResponse
    {
        $data = $request->validated();

        if (! array_key_exists('status', $data)) {
            try {
                $result = $this->service->applyAdminChange((int) $id, $data);

                return ResponseHelper::success(AlumniServiceRequestResource::make($result['request']), trans('alert.update_success', ['resource' => self::LABEL]));
            } catch (Throwable $th) {
                return $this->writeError($th);
            }
        }

        DB::beginTransaction();
        try {
            $result = $this->service->applyAdminChange((int) $id, $data);
            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();

            return $this->writeError($th);
        }

        $notification = $result['notification'];
        if ($notification && $this->composer->shouldPush($result['request']->status)) {
            SendDeviceNotificationJob::dispatch($notification->id);
        }

        return ResponseHelper::success(AlumniServiceRequestResource::make($result['request']), trans('alert.update_success', ['resource' => self::LABEL]));
    }

    /**
     * Hapus pengajuan beserta notifikasinya (tabel notifikasi terhapus lewat cascade).
     *
     * @param  string  $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->service->delete((int) $id);

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => self::LABEL]));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
