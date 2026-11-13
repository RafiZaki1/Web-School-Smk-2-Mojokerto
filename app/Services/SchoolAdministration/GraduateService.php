<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\GraduateRepositoryInterface;
use App\Contracts\Interfaces\GraduateServiceInterface;
use App\Enums\SchoolClassEnum;
use App\Models\Graduate;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GraduateService implements GraduateServiceInterface
{
    /**
     * Inisialisasi GraduateService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GraduateRepositoryInterface  $repository
     */
    public function __construct(protected GraduateRepositoryInterface $repository) {}

    /**
     * Ambil data siswa untuk tabel kerja TU.
     *
     * @param  array<string, mixed>  $filters
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function paginate(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repository->paginateForAdmin($filters, $perPage);
    }

    /**
     * Ambil satu data siswa.
     *
     * @param  int|string  $id
     * @return Graduate
     */
    public function find(int|string $id): Graduate
    {
        /** @var Graduate */
        return $this->repository->findOrFail($id);
    }

    /**
     * Simpan siswa baru; kode jurusan diturunkan dari kelas.
     *
     * @param  array<string, mixed>  $data
     * @return Graduate
     */
    public function create(array $data): Graduate
    {
        /** @var Graduate */
        return $this->repository->create($this->withMajor($data));
    }

    /**
     * Perbarui sebagian data siswa (dipakai auto-save tabel kerja TU).
     *
     * @param  array<string, mixed>  $data
     * @param  int|string  $id
     * @return Graduate
     */
    public function update(int|string $id, array $data): Graduate
    {
        /** @var Graduate */
        return $this->repository->update($this->find($id), $this->withMajor($data));
    }

    /**
     * Hapus satu data siswa.
     *
     * @param  int|string  $id
     * @return bool
     */
    public function delete(int|string $id): bool
    {
        return $this->repository->delete($this->find($id));
    }

    /**
     * Ringkasan jumlah siswa aktif dan arsip per tahun lulus.
     *
     * @return array<int, array{year: int, active: int, archived: int}>
     */
    public function years(): array
    {
        return $this->repository->yearSummaries();
    }

    /**
     * Arsipkan satu angkatan ke Direktori Lulusan.
     *
     * @param  int  $year
     * @return int
     */
    public function archiveYear(int $year): int
    {
        return $this->repository->archiveYear($year);
    }

    /**
     * Hapus seluruh data satu angkatan.
     *
     * @param  int  $year
     * @return int
     */
    public function deleteYear(int $year): int
    {
        return $this->repository->deleteYear($year);
    }

    /**
     * Isi kode jurusan dari kelas bila kelas ikut dikirim.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function withMajor(array $data): array
    {
        if (! empty($data['class_name'])) {
            $data['major_code'] = SchoolClassEnum::from($data['class_name'])->major()->value;
        }

        return $data;
    }
}
