<?php

namespace App\Services\SchoolAdministration;

use App\Enums\AdministrationStatusEnum;
use App\Enums\GraduationStatusEnum;
use App\Enums\SchoolClassEnum;
use Illuminate\Support\Carbon;
use InvalidArgumentException;
use Throwable;

/**
 * Mengubah satu baris file impor kelulusan menjadi data siap simpan.
 * Kolom dikenali dari judul baris pertama, tidak bergantung urutan.
 */
class GraduateRowParser
{
    /** Judul kolom yang diterima untuk setiap field. */
    public const HEADERS = [
        'nisn' => ['nisn'],
        'full_name' => ['nama_lengkap', 'nama', 'nama_siswa'],
        'birth_date' => ['tanggal_lahir', 'tgl_lahir'],
        'class_name' => ['kelas'],
        'graduation_year' => ['tahun_lulus', 'tahun'],
        'status' => ['status', 'status_kelulusan'],
        'administration_status' => ['status_administrasi', 'administrasi'],
        'note' => ['catatan', 'keterangan'],
    ];

    /**
     * Petakan judul kolom ke indeks kolom. Field wajib yang tidak ditemukan memicu galat.
     *
     * @param  array<int, string>  $header
     * @return array<string, int>
     *
     * @throws InvalidArgumentException
     */
    public function columns(array $header): array
    {
        $normalized = array_map(fn (string $cell) => (string) preg_replace('/[^a-z0-9]+/', '_', mb_strtolower(trim($cell))), $header);
        $columns = [];

        foreach (self::HEADERS as $field => $aliases) {
            $index = collect($aliases)->map(fn (string $alias) => array_search($alias, $normalized, true))->first(fn ($found) => $found !== false);
            if ($index !== null) {
                $columns[$field] = (int) $index;
            }
        }

        $missing = array_diff(['nisn', 'full_name', 'birth_date', 'class_name'], array_keys($columns));
        if ($missing !== []) {
            throw new InvalidArgumentException('Kolom wajib tidak ditemukan: '.implode(', ', array_map(fn ($field) => self::HEADERS[$field][0], $missing)).'.');
        }

        return $columns;
    }

    /**
     * Ubah satu baris menjadi data graduates.
     *
     * @param  array<int, string>  $row
     * @param  array<string, int>  $columns
     * @param  int  $defaultYear
     * @return array<string, mixed>
     *
     * @throws InvalidArgumentException
     */
    public function parse(array $row, array $columns, int $defaultYear): array
    {
        $value = fn (string $field) => isset($columns[$field]) ? trim((string) ($row[$columns[$field]] ?? '')) : '';

        $nisn = preg_replace('/\D/', '', $value('nisn')) ?? '';
        $class = SchoolClassEnum::fromInput($value('class_name'));
        $year = $value('graduation_year') !== '' ? (int) $value('graduation_year') : $defaultYear;

        $errors = array_filter([
            strlen($nisn) < 8 || strlen($nisn) > 20 ? 'NISN harus 8 sampai 20 digit' : null,
            $value('full_name') === '' ? 'nama lengkap kosong' : null,
            $class === null ? "kelas \"{$value('class_name')}\" tidak dikenal" : null,
            $year < 2000 || $year > 2100 ? 'tahun lulus tidak valid' : null,
        ]);

        $birthDate = $this->date($value('birth_date'));
        if ($birthDate === null) {
            $errors[] = 'tanggal lahir tidak valid';
        }

        if ($errors !== []) {
            throw new InvalidArgumentException(ucfirst(implode(', ', $errors)).'.');
        }

        return [
            'nisn' => $nisn,
            'full_name' => mb_substr($value('full_name'), 0, 255),
            'birth_date' => $birthDate,
            'class_name' => $class->value,
            'major_code' => $class->major()->value,
            'graduation_year' => $year,
            'status' => (GraduationStatusEnum::fromInput($value('status')) ?? $this->guessStatus($value('status')))->value,
            'administration_status' => $this->administration($value('administration_status'))->value,
            'note' => $value('note') !== '' ? mb_substr($value('note'), 0, 2000) : null,
        ];
    }

    /**
     * Ubah tanggal dari angka seri Excel atau format umum (2008-05-10, 10/05/2008, 10-05-2008) ke Y-m-d.
     *
     * @param  string  $value
     * @return ?string
     */
    private function date(string $value): ?string
    {
        if ($value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return Carbon::create(1899, 12, 30)->addDays((int) $value)->format('Y-m-d');
        }

        foreach (['Y-m-d', 'd/m/Y', 'd-m-Y', 'd.m.Y', 'Y/m/d'] as $format) {
            try {
                $date = Carbon::createFromFormat("!{$format}", $value);
                if ($date && $date->format($format) === $value) {
                    return $date->format('Y-m-d');
                }
            } catch (Throwable) {
                continue;
            }
        }

        return null;
    }

    /**
     * Status kelulusan dari teks bebas; kosong atau tidak dikenal dianggap Lulus kecuali menyebut "tunda".
     *
     * @param  string  $value
     * @return GraduationStatusEnum
     */
    private function guessStatus(string $value): GraduationStatusEnum
    {
        return str_contains(mb_strtolower($value), 'tunda') || str_contains(mb_strtolower($value), 'tidak')
            ? GraduationStatusEnum::DEFERRED
            : GraduationStatusEnum::PASSED;
    }

    /**
     * Status administrasi dari teks bebas, mis. "Beres", "Belum", atau "Belum Beres".
     *
     * @param  string  $value
     * @return AdministrationStatusEnum
     */
    private function administration(string $value): AdministrationStatusEnum
    {
        $text = mb_strtolower($value);

        if (str_contains($text, 'belum') || $text === 'pending') {
            return AdministrationStatusEnum::PENDING;
        }

        return AdministrationStatusEnum::fromInput($value) ?? ($text === '' ? AdministrationStatusEnum::PENDING : AdministrationStatusEnum::CLEARED);
    }
}
