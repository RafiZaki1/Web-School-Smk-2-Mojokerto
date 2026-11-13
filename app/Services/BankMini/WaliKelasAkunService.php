<?php

namespace App\Services\BankMini;

use App\Contracts\Interfaces\WaliKelasAkunServiceInterface;
use App\Enums\RoleEnum;
use Illuminate\Support\Str;

class WaliKelasAkunService implements WaliKelasAkunServiceInterface
{
    /**
     * Susun kolom tabel users untuk akun wali kelas. Kolom email wajib di tabel users,
     * jadi akun baru diberi alamat internal berdomain .invalid (RFC 2606, tidak bisa
     * menerima surel) supaya tidak tertukar dengan email sungguhan. Password kosong saat
     * edit berarti tidak diganti.
     *
     * @param  array<string, mixed>  $data
     * @param  string  $kelas
     * @param  bool  $baru
     * @return array<string, mixed>
     */
    public function payloadAkun(array $data, string $kelas, bool $baru): array
    {
        $payload = [
            'name' => trim((string) $data['nama']),
            'username' => Str::lower(trim((string) $data['username'])),
            'role' => RoleEnum::WALI_KELAS->value,
        ];

        if ($baru) {
            $payload['email'] = 'walas-'.Str::slug($kelas).'-'.Str::lower(Str::random(6)).'@bank-mini.invalid';
        }

        if (filled($data['password'] ?? null)) {
            $payload['password'] = (string) $data['password'];
        }

        return $payload;
    }
}
