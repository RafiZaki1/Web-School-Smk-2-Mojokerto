<?php

namespace App\Enums\BankMini;

/**
 * Bulan kalender (1-12) dengan urutan tahun ajaran: Juli sampai Juni.
 */
enum BulanAkademikEnum: int
{
    case JULI = 7;
    case AGUSTUS = 8;
    case SEPTEMBER = 9;
    case OKTOBER = 10;
    case NOVEMBER = 11;
    case DESEMBER = 12;
    case JANUARI = 1;
    case FEBRUARI = 2;
    case MARET = 3;
    case APRIL = 4;
    case MEI = 5;
    case JUNI = 6;

    /**
     * Nama bulan Bahasa Indonesia.
     *
     * @return string
     */
    public function nama(): string
    {
        return match ($this) {
            self::JANUARI => 'Januari',
            self::FEBRUARI => 'Februari',
            self::MARET => 'Maret',
            self::APRIL => 'April',
            self::MEI => 'Mei',
            self::JUNI => 'Juni',
            self::JULI => 'Juli',
            self::AGUSTUS => 'Agustus',
            self::SEPTEMBER => 'September',
            self::OKTOBER => 'Oktober',
            self::NOVEMBER => 'November',
            self::DESEMBER => 'Desember',
        };
    }

    /**
     * Nama bulan tiga huruf, mis. "Jul".
     *
     * @return string
     */
    public function singkat(): string
    {
        return mb_substr($this->nama(), 0, 3);
    }

    /**
     * Posisi bulan dalam tahun ajaran, 1 (Juli) sampai 12 (Juni).
     *
     * @return int
     */
    public function urutan(): int
    {
        return $this->value >= 7 ? $this->value - 6 : $this->value + 6;
    }

    /**
     * Tahun kalender bulan ini untuk tahun ajaran "2026/2027": Juli-Desember 2026, Januari-Juni 2027.
     *
     * @param  string  $tahunAjaran
     * @return int
     */
    public function tahunKalender(string $tahunAjaran): int
    {
        [$awal, $akhir] = array_map('intval', explode('/', $tahunAjaran));

        return $this->value >= 7 ? $awal : $akhir;
    }
}
