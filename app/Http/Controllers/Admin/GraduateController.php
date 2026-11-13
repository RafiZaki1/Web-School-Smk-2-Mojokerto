<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\GraduateServiceInterface;
use App\Contracts\Interfaces\GraduationServiceInterface;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\GraduateRequest;
use App\Http\Requests\GraduateYearRequest;
use App\Http\Resources\GraduateResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Tabel kerja kelulusan TU: daftar per kelas, CRUD satuan untuk revisi manual,
 * dan aksi per angkatan (arsipkan ke Direktori Lulusan atau hapus).
 */
class GraduateController extends Controller
{
    private const LABEL = 'Data kelulusan';

    private const FILTERS = ['year', 'class', 'major', 'status', 'administration', 'search', 'archived'];

    /**
     * Inisialisasi GraduateController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GraduateServiceInterface  $service
     * @param  GraduationServiceInterface  $graduation
     */
    public function __construct(
        protected GraduateServiceInterface $service,
        protected GraduationServiceInterface $graduation,
    ) {}

    /**
     * Tampilkan data siswa per halaman. Tanpa filter tahun, yang tampil angkatan aktif.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = array_filter($request->only(self::FILTERS), fn ($value) => is_string($value) && $value !== '');
        $filters['year'] ??= (string) $this->graduation->settings()->active_year;
        $filters['archived'] = filter_var($filters['archived'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $perPage = min(100, max(10, (int) $request->query('per_page', 50)));

        return ResponseHelper::paginate(
            $this->service->paginate($filters, $perPage),
            GraduateResource::class,
            trans('alert.fetch_success', ['resource' => self::LABEL]),
        );
    }

    /**
     * Ringkasan jumlah siswa aktif dan arsip per tahun lulus.
     *
     * @return JsonResponse
     */
    public function years(): JsonResponse
    {
        return ResponseHelper::success($this->service->years(), trans('alert.fetch_success', ['resource' => 'Tahun lulus']));
    }

    /**
     * Tambah satu siswa secara manual.
     *
     * @param  GraduateRequest  $request
     * @return JsonResponse
     */
    public function store(GraduateRequest $request): JsonResponse
    {
        try {
            return ResponseHelper::success(
                GraduateResource::make($this->service->create($request->validated())),
                trans('alert.add_success', ['resource' => self::LABEL]),
                Response::HTTP_CREATED
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Perbarui sebagian data siswa (auto-save satu sel tabel).
     *
     * @param  GraduateRequest  $request
     * @param  string  $id
     * @return JsonResponse
     */
    public function update(GraduateRequest $request, string $id): JsonResponse
    {
        try {
            return ResponseHelper::success(
                GraduateResource::make($this->service->update($id, $request->validated())),
                trans('alert.update_success', ['resource' => self::LABEL])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus satu siswa.
     *
     * @param  string  $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->service->delete($id);

            return ResponseHelper::success(null, trans('alert.delete_success', ['resource' => self::LABEL]));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Arsipkan satu angkatan agar tampil di Direktori Lulusan publik.
     *
     * @param  GraduateYearRequest  $request
     * @return JsonResponse
     */
    public function archive(GraduateYearRequest $request): JsonResponse
    {
        try {
            $count = $this->service->archiveYear((int) $request->validated('year'));

            return ResponseHelper::success(['affected' => $count], trans('alert.graduates_archived', ['count' => $count]));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Hapus seluruh data satu angkatan.
     *
     * @param  GraduateYearRequest  $request
     * @return JsonResponse
     */
    public function destroyYear(GraduateYearRequest $request): JsonResponse
    {
        try {
            $count = $this->service->deleteYear((int) $request->validated('year'));

            return ResponseHelper::success(['affected' => $count], trans('alert.graduates_deleted', ['count' => $count]));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
