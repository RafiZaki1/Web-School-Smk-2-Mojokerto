<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\GraduateRepositoryInterface;
use App\Enums\AdministrationStatusEnum;
use App\Enums\GraduationStatusEnum;
use App\Models\Graduate;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class GraduateRepository extends BaseRepository implements GraduateRepositoryInterface
{
    /** @var class-string<Graduate> */
    protected string $model = Graduate::class;

    /** Kolom yang ditimpa saat baris impor dengan NISN yang sama sudah ada. */
    private const UPSERT_COLUMNS = [
        'full_name', 'birth_date', 'class_name', 'major_code', 'graduation_year',
        'status', 'administration_status', 'note', 'is_archived', 'archived_at', 'updated_at',
    ];

    /**
     * Ambil data kelulusan untuk tabel kerja TU dengan filter tahun, kelas, jurusan, status, dan pencarian.
     *
     * @param  array<string, mixed>  $filters
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function paginateForAdmin(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->query()
            ->where('is_archived', (bool) ($filters['archived'] ?? false))
            ->when($filters['year'] ?? null, fn (Builder $q, $year) => $q->where('graduation_year', (int) $year))
            ->when($filters['status'] ?? null, fn (Builder $q, $status) => $q->where('status', $status))
            ->when($filters['administration'] ?? null, fn (Builder $q, $value) => $q->where('administration_status', $value))
            ->forClass($filters['class'] ?? null)
            ->forMajor($filters['major'] ?? null)
            ->search($filters['search'] ?? null)
            ->ordered()
            ->paginate($perPage);
    }

    /**
     * Cari siswa angkatan aktif berdasarkan NISN, lalu cocokkan nama lengkapnya.
     * Nama dibandingkan tanpa beda huruf besar/kecil, spasi ganda, dan tanda baca.
     *
     * @param  string  $nisn
     * @param  string  $fullName
     * @param  int  $year
     * @return ?Graduate
     */
    public function findForCheck(string $nisn, string $fullName, int $year): ?Graduate
    {
        $graduate = $this->query()
            ->where('nisn', $nisn)
            ->activeYear($year)
            ->first();

        return $graduate && self::normalizeName($graduate->full_name) === self::normalizeName($fullName) ? $graduate : null;
    }

    /**
     * Nama untuk dicocokkan: huruf kecil, tanpa tanda baca, spasi tunggal.
     *
     * @param  string  $name
     * @return string
     */
    private static function normalizeName(string $name): string
    {
        $letters = preg_replace('/[^\p{L}\p{N}\s]/u', '', mb_strtolower($name)) ?? '';

        return trim(preg_replace('/\s+/u', ' ', $letters) ?? '');
    }

    /**
     * Periksa apakah NISN sudah dipakai siswa lain.
     *
     * @param  string  $nisn
     * @param  ?int  $ignoreId
     * @return bool
     */
    public function nisnExists(string $nisn, ?int $ignoreId = null): bool
    {
        return $this->query()
            ->where('nisn', $nisn)
            ->when($ignoreId, fn (Builder $q) => $q->whereKeyNot($ignoreId))
            ->exists();
    }

    /**
     * Ambil NISN dari daftar yang sudah tersimpan, dipakai untuk menghitung data baru vs diperbarui saat impor.
     *
     * @param  array<int, string>  $nisns
     * @return array<int, string>
     */
    public function existingNisns(array $nisns): array
    {
        return $this->query()->whereIn('nisn', $nisns)->pluck('nisn')->all();
    }

    /**
     * Simpan baris impor sekaligus; NISN yang sudah ada diperbarui (unique index kolom nisn).
     *
     * @param  array<int, array<string, mixed>>  $rows
     * @return int
     */
    public function upsertByNisn(array $rows): int
    {
        $now = Carbon::now();
        $rows = array_map(fn (array $row) => [...$row, 'is_archived' => false, 'archived_at' => null, 'created_at' => $now, 'updated_at' => $now], $rows);

        return $this->query()->upsert($rows, ['nisn'], self::UPSERT_COLUMNS);
    }

    /**
     * Ringkasan jumlah siswa aktif dan arsip per tahun lulus.
     *
     * @return array<int, array{year: int, active: int, archived: int}>
     */
    public function yearSummaries(): array
    {
        return $this->query()
            ->selectRaw('graduation_year, SUM(CASE WHEN is_archived = 0 THEN 1 ELSE 0 END) AS active, SUM(CASE WHEN is_archived = 1 THEN 1 ELSE 0 END) AS archived')
            ->groupBy('graduation_year')
            ->orderByDesc('graduation_year')
            ->get()
            ->map(fn ($row) => ['year' => (int) $row->graduation_year, 'active' => (int) $row->active, 'archived' => (int) $row->archived])
            ->all();
    }

    /**
     * Hitung status kelulusan dan administrasi angkatan aktif dalam satu query agregat.
     *
     * @param  int  $year
     * @return array{total: int, passed: int, deferred: int, administration_pending: int}
     */
    public function statusSummary(int $year): array
    {
        $row = $this->query()
            ->activeYear($year)
            ->selectRaw('COUNT(*) AS total, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS passed, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS deferred, SUM(CASE WHEN administration_status = ? THEN 1 ELSE 0 END) AS administration_pending', [
                GraduationStatusEnum::PASSED->value,
                GraduationStatusEnum::DEFERRED->value,
                AdministrationStatusEnum::PENDING->value,
            ])
            ->first();

        return [
            'total' => (int) ($row->total ?? 0),
            'passed' => (int) ($row->passed ?? 0),
            'deferred' => (int) ($row->deferred ?? 0),
            'administration_pending' => (int) ($row->administration_pending ?? 0),
        ];
    }

    /**
     * Pindahkan seluruh siswa satu tahun lulus ke Direktori Lulusan publik.
     *
     * @param  int  $year
     * @return int Jumlah baris yang diarsipkan
     */
    public function archiveYear(int $year): int
    {
        return $this->query()
            ->where('graduation_year', $year)
            ->where('is_archived', false)
            ->update(['is_archived' => true, 'archived_at' => Carbon::now(), 'updated_at' => Carbon::now()]);
    }

    /**
     * Hapus seluruh data satu tahun lulus, baik aktif maupun arsip.
     *
     * @param  int  $year
     * @return int Jumlah baris yang dihapus
     */
    public function deleteYear(int $year): int
    {
        return $this->query()->where('graduation_year', $year)->delete();
    }

    /**
     * Ambil NISN, nama, dan kelas siswa angkatan aktif (belum diarsipkan) untuk disalin ke akun Bank Mini.
     *
     * @param  int  $year
     * @return Collection
     */
    public function rosterActiveYear(int $year): Collection
    {
        return $this->query()
            ->activeYear($year)
            ->ordered()
            ->toBase()
            ->get(['nisn', 'full_name', 'class_name', 'major_code']);
    }
}
