<?php

namespace App\Services\BankMini;

use App\Contracts\Interfaces\SiteContentRepositoryInterface;

/**
 * Status buka/tutup portal siswa Bank Mini. Disimpan sebagai satu baris site_contents
 * supaya tidak perlu tabel baru; petugas dan admin mengubahnya dari panel.
 */
class StatusLayananService
{
    public const KUNCI = 'bank_mini_status_layanan';

    /**
     * Inisialisasi StatusLayananService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  SiteContentRepositoryInterface  $konten
     */
    public function __construct(
        protected SiteContentRepositoryInterface $konten,
    ) {}

    /**
     * Status layanan saat ini. Belum pernah diatur berarti buka.
     *
     * @return array{tutup: bool, pesan: ?string, diubah_oleh: ?string, diubah_at: ?string}
     */
    public function baca(): array
    {
        $nilai = $this->konten->findByKey(self::KUNCI)?->value ?? [];

        return [
            'tutup' => (bool) ($nilai['tutup'] ?? false),
            'pesan' => $nilai['pesan'] ?? null,
            'diubah_oleh' => $nilai['diubah_oleh'] ?? null,
            'diubah_at' => $nilai['diubah_at'] ?? null,
        ];
    }

    /**
     * Susun nilai yang disimpan saat petugas menutup atau membuka layanan.
     *
     * @param  bool  $tutup
     * @param  ?string  $pesan  pengumuman untuk siswa, mis. alasan dan kapan buka lagi
     * @param  ?string  $namaPetugas
     * @return array{tutup: bool, pesan: ?string, diubah_oleh: ?string, diubah_at: string}
     */
    public function payload(bool $tutup, ?string $pesan, ?string $namaPetugas): array
    {
        return [
            'tutup' => $tutup,
            'pesan' => filled($pesan) ? trim((string) $pesan) : null,
            'diubah_oleh' => $namaPetugas,
            'diubah_at' => now()->toIso8601String(),
        ];
    }
}
