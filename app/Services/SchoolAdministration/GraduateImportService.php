<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\GraduateImportServiceInterface;
use App\Contracts\Interfaces\GraduateRepositoryInterface;
use Illuminate\Http\UploadedFile;
use InvalidArgumentException;

/**
 * Baris yang valid disimpan (NISN yang sama diperbarui), baris yang tidak valid dilewati
 * dan dilaporkan nomor barisnya agar TU bisa memperbaiki file lalu mengunggah ulang.
 */
class GraduateImportService implements GraduateImportServiceInterface
{
    private const CHUNK_SIZE = 200;

    private const MAX_REPORTED_ERRORS = 50;

    /**
     * Inisialisasi GraduateImportService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GraduateRepositoryInterface  $graduates
     * @param  SpreadsheetReader  $reader
     * @param  GraduateRowParser  $parser
     */
    public function __construct(
        protected GraduateRepositoryInterface $graduates,
        protected SpreadsheetReader $reader,
        protected GraduateRowParser $parser,
    ) {}

    /**
     * Impor file lalu kembalikan ringkasan hasilnya.
     *
     * @param  UploadedFile  $file
     * @param  int  $defaultYear
     * @return array{total: int, created: int, updated: int, skipped: int, errors: array<int, array{row: int, message: string}>}
     *
     * @throws InvalidArgumentException
     */
    public function import(UploadedFile $file, int $defaultYear): array
    {
        $rows = $this->reader->read($file->getRealPath(), $file->getClientOriginalExtension());
        $header = array_shift($rows) ?? [];
        $columns = $this->parser->columns($header);

        ['valid' => $valid, 'errors' => $errors, 'total' => $total] = $this->parseRows($rows, $columns, $defaultYear);

        if ($total === 0) {
            throw new InvalidArgumentException('File tidak berisi data siswa.');
        }

        $existing = array_flip($this->graduates->existingNisns(array_keys($valid)));
        foreach (array_chunk(array_values($valid), self::CHUNK_SIZE) as $chunk) {
            $this->graduates->upsertByNisn($chunk);
        }

        $updated = count(array_intersect_key($valid, $existing));

        return [
            'total' => $total,
            'created' => count($valid) - $updated,
            'updated' => $updated,
            'skipped' => $total - count($valid),
            'errors' => array_slice($errors, 0, self::MAX_REPORTED_ERRORS),
        ];
    }

    /**
     * Parse seluruh baris data. Baris kosong diabaikan; NISN ganda dalam file memakai baris terakhir.
     *
     * @param  array<int, array<int, string>>  $rows
     * @param  array<string, int>  $columns
     * @param  int  $defaultYear
     * @return array{valid: array<string, array<string, mixed>>, errors: array<int, array{row: int, message: string}>, total: int}
     */
    private function parseRows(array $rows, array $columns, int $defaultYear): array
    {
        $valid = [];
        $errors = [];
        $total = 0;

        foreach ($rows as $index => $row) {
            if (implode('', $row) === '') {
                continue;
            }

            $total++;
            try {
                $data = $this->parser->parse($row, $columns, $defaultYear);
                $valid[$data['nisn']] = $data;
            } catch (InvalidArgumentException $exception) {
                $errors[] = ['row' => $index + 2, 'message' => $exception->getMessage()];
            }
        }

        return ['valid' => $valid, 'errors' => $errors, 'total' => $total];
    }
}
