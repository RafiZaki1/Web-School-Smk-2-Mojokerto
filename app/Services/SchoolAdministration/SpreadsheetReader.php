<?php

namespace App\Services\SchoolAdministration;

use RuntimeException;
use SimpleXMLElement;

/**
 * Membaca sheet pertama file CSV atau XLSX menjadi daftar baris berisi teks.
 * XLSX dibaca langsung dari arsip ZIP dengan zlib, jadi tidak butuh ekstensi zip
 * maupun library tambahan. Sel tanggal Excel tetap berupa angka seri (mis. 39578).
 */
class SpreadsheetReader
{
    /**
     * Baca file menjadi array baris; setiap baris berupa array sel teks.
     *
     * @param  string  $path
     * @param  string  $extension
     * @return array<int, array<int, string>>
     *
     * @throws RuntimeException
     */
    public function read(string $path, string $extension): array
    {
        return strtolower($extension) === 'xlsx' ? $this->readXlsx($path) : $this->readCsv($path);
    }

    /**
     * Baca CSV dengan pemisah koma, titik koma, atau tab (Excel Indonesia memakai titik koma).
     *
     * @param  string  $path
     * @return array<int, array<int, string>>
     */
    private function readCsv(string $path): array
    {
        $content = (string) file_get_contents($path);
        $content = preg_replace('/^\xEF\xBB\xBF/', '', $content) ?? $content;
        $firstLine = strtok($content, "\r\n") ?: '';
        $delimiter = collect([',', ';', "\t"])->sortByDesc(fn (string $char) => substr_count($firstLine, $char))->first();

        $handle = fopen('php://temp', 'r+');
        fwrite($handle, $content);
        rewind($handle);

        $rows = [];
        while (($row = fgetcsv($handle, null, $delimiter, '"', '')) !== false) {
            $rows[] = array_map(fn ($cell) => trim((string) $cell), $row);
        }
        fclose($handle);

        return $rows;
    }

    /**
     * Baca sheet pertama XLSX beserta tabel teks bersama (sharedStrings).
     *
     * @param  string  $path
     * @return array<int, array<int, string>>
     *
     * @throws RuntimeException
     */
    private function readXlsx(string $path): array
    {
        $entries = $this->zipEntries((string) file_get_contents($path));
        $sheet = $entries['xl/worksheets/sheet1.xml'] ?? null;

        if ($sheet === null) {
            throw new RuntimeException('Sheet pertama tidak ditemukan di file Excel.');
        }

        $shared = isset($entries['xl/sharedStrings.xml']) ? $this->sharedStrings($entries['xl/sharedStrings.xml']) : [];
        $xml = new SimpleXMLElement($sheet);
        $rows = [];

        foreach ($xml->sheetData->row as $row) {
            $cells = [];
            foreach ($row->c as $cell) {
                $cells[$this->columnIndex((string) $cell['r'])] = $this->cellValue($cell, $shared);
            }
            $rows[] = $cells === [] ? [] : array_replace(array_fill(0, max(array_keys($cells)) + 1, ''), $cells);
        }

        return $rows;
    }

    /**
     * Ambil isi file XML yang dibutuhkan dari arsip ZIP lewat central directory.
     *
     * @param  string  $zip
     * @return array<string, string>
     *
     * @throws RuntimeException
     */
    private function zipEntries(string $zip): array
    {
        $eocd = strrpos($zip, "PK\x05\x06");
        if ($eocd === false) {
            throw new RuntimeException('File Excel tidak valid atau rusak.');
        }

        ['count' => $count, 'offset' => $offset] = unpack('vcount/x4/Voffset', substr($zip, $eocd + 10, 10));
        $entries = [];

        for ($i = 0; $i < $count; $i++) {
            $header = unpack('vmethod/x8/Vsize/x4/vname/vextra/vcomment/x8/Vlocal', substr($zip, $offset + 10, 36));
            $name = substr($zip, $offset + 46, $header['name']);
            $offset += 46 + $header['name'] + $header['extra'] + $header['comment'];

            if (! str_starts_with($name, 'xl/sharedStrings') && $name !== 'xl/worksheets/sheet1.xml') {
                continue;
            }

            $local = unpack('vname/vextra', substr($zip, $header['local'] + 26, 4));
            $data = substr($zip, $header['local'] + 30 + $local['name'] + $local['extra'], $header['size']);
            $entries[$name] = $header['method'] === 8 ? (string) gzinflate($data) : $data;
        }

        return $entries;
    }

    /**
     * Daftar teks bersama; teks berformat (rich text) digabung dari seluruh potongannya.
     *
     * @param  string  $xml
     * @return array<int, string>
     */
    private function sharedStrings(string $xml): array
    {
        $strings = [];
        foreach ((new SimpleXMLElement($xml))->si as $item) {
            $strings[] = isset($item->t) ? (string) $item->t : implode('', array_map('strval', $item->xpath('.//*[local-name()="t"]') ?: []));
        }

        return $strings;
    }

    /**
     * Nilai teks satu sel sesuai tipenya (teks bersama, teks langsung, atau angka).
     *
     * @param  array<int, string>  $shared
     * @param  SimpleXMLElement  $cell
     * @return string
     */
    private function cellValue(SimpleXMLElement $cell, array $shared): string
    {
        return trim(match ((string) $cell['t']) {
            's' => $shared[(int) $cell->v] ?? '',
            'inlineStr' => (string) $cell->is->t,
            default => (string) $cell->v,
        });
    }

    /**
     * Ubah referensi sel (mis. "C12") menjadi indeks kolom berbasis 0.
     *
     * @param  string  $reference
     * @return int
     */
    private function columnIndex(string $reference): int
    {
        $letters = preg_replace('/\d+/', '', strtoupper($reference)) ?: 'A';
        $index = 0;
        foreach (str_split($letters) as $letter) {
            $index = $index * 26 + (ord($letter) - 64);
        }

        return $index - 1;
    }
}
