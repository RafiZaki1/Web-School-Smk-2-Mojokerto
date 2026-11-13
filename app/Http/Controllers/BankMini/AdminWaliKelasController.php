<?php

namespace App\Http\Controllers\BankMini;

use App\Contracts\Interfaces\TeacherRepositoryInterface;
use App\Contracts\Interfaces\UserRepositoryInterface;
use App\Contracts\Interfaces\WaliKelasAkunServiceInterface;
use App\Contracts\Interfaces\WaliKelasRepositoryInterface;
use App\Enums\SchoolClassEnum;
use App\Helpers\AcademicYearHelper;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\WaliKelasRequest;
use App\Models\WaliKelas;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Pengelolaan akun wali kelas oleh petugas TU: satu akun per kelas, opsional ditautkan ke data guru.
 */
class AdminWaliKelasController extends Controller
{
    /**
     * Inisialisasi AdminWaliKelasController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  WaliKelasRepositoryInterface  $waliKelas
     * @param  UserRepositoryInterface  $user
     * @param  TeacherRepositoryInterface  $guru
     * @param  WaliKelasAkunServiceInterface  $akun
     */
    public function __construct(
        protected WaliKelasRepositoryInterface $waliKelas,
        protected UserRepositoryInterface $user,
        protected TeacherRepositoryInterface $guru,
        protected WaliKelasAkunServiceInterface $akun,
    ) {}

    /**
     * Daftar 12 kelas beserta akun wali kelasnya.
     *
     * @return View
     */
    public function index(): View
    {
        return view('bank-mini.admin.wali-kelas', [
            'daftarKelas' => SchoolClassEnum::values(),
            'penautan' => $this->waliKelas->semuaPerKelas(),
            'guru' => $this->guru->all()->map(fn ($g) => ['id' => $g->id, 'nama' => $g->name, 'jabatan' => $g->position])->values(),
            'tahun' => AcademicYearHelper::current(),
        ]);
    }

    /**
     * Buat atau perbarui akun wali kelas satu kelas. Dua tabel berubah (users, wali_kelas),
     * jadi dibungkus DB transaction.
     *
     * @param  WaliKelasRequest  $request
     * @param  string  $kelas
     * @return JsonResponse
     */
    public function simpan(WaliKelasRequest $request, string $kelas): JsonResponse
    {
        if (SchoolClassEnum::tryFrom($kelas) === null) {
            return ResponseHelper::error(null, trans('alert.walas_class_unknown'), Response::HTTP_NOT_FOUND);
        }

        $ada = $this->waliKelas->findByKelas($kelas);
        $data = $request->validated();

        if ($this->user->usernameDipakai(strtolower($data['username']), $ada?->user_id)) {
            return ResponseHelper::error(['username' => [trans('alert.walas_username_taken')]], trans('alert.walas_username_taken'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (! $ada && blank($data['password'] ?? null)) {
            return ResponseHelper::error(['password' => [trans('alert.walas_password_required')]], trans('alert.walas_password_required'), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        DB::beginTransaction();
        try {
            $this->simpanAkun($ada, $data, $kelas);
            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();

            return $this->writeError($th);
        }

        return ResponseHelper::success(null, trans('alert.walas_saved', ['kelas' => $kelas]));
    }

    /**
     * Hapus akun wali kelas suatu kelas. Baris wali_kelas ikut terhapus lewat cascade FK.
     *
     * @param  string  $kelas
     * @return JsonResponse
     */
    public function hapus(string $kelas): JsonResponse
    {
        $ada = $this->waliKelas->findByKelas($kelas);

        if (! $ada || ! $ada->user) {
            return ResponseHelper::error(null, trans('alert.not_found'), Response::HTTP_NOT_FOUND);
        }

        try {
            $this->user->delete($ada->user);

            return ResponseHelper::success(null, trans('alert.walas_deleted', ['kelas' => $kelas]));
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }

    /**
     * Tulis akun users dan penautan wali_kelas (dipanggil di dalam DB transaction).
     *
     * @param  ?WaliKelas  $ada
     * @param  array<string, mixed>  $data
     * @param  string  $kelas
     * @return void
     */
    private function simpanAkun(?WaliKelas $ada, array $data, string $kelas): void
    {
        $teacherId = $data['teacher_id'] ?? null;

        if ($ada) {
            $this->user->update($ada->user, $this->akun->payloadAkun($data, $kelas, false));
            $this->waliKelas->update($ada, ['teacher_id' => $teacherId]);

            return;
        }

        $user = $this->user->create($this->akun->payloadAkun($data, $kelas, true));
        $this->waliKelas->create(['kelas' => $kelas, 'user_id' => $user->getKey(), 'teacher_id' => $teacherId]);
    }
}
