<?php

namespace App\Models;

use App\Observers\SiswaObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Akun siswa portal Bank Mini (guard "siswa"). Username = NISN, password awal = NISN.
 * Password default diisi SiswaObserver saat siswa dibuat.
 */
#[ObservedBy(SiswaObserver::class)]
class Siswa extends Authenticatable
{
    protected $table = 'siswa';

    /** @var array<int, string> */
    protected $fillable = [
        'nisn',
        'nama',
        'kelas',
        'jurusan',
        'password',
        'password_changed_at',
        'is_active',
    ];

    /** @var array<int, string> */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Atribut yang di-cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'password_changed_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Tagihan SPP bulanan milik siswa.
     *
     * @return HasMany
     */
    public function tagihanSpp(): HasMany
    {
        return $this->hasMany(TagihanSpp::class);
    }

    /**
     * Transaksi pembayaran milik siswa.
     *
     * @return HasMany
     */
    public function transaksi(): HasMany
    {
        return $this->hasMany(TransaksiBankMini::class);
    }

    /**
     * Apakah siswa masih memakai password default (NISN).
     *
     * @return bool
     */
    public function masihPasswordDefault(): bool
    {
        return $this->password_changed_at === null;
    }

    /**
     * Dua huruf awal nama untuk avatar.
     *
     * @return string
     */
    public function inisial(): string
    {
        $kata = preg_split('/\s+/', trim((string) $this->nama)) ?: [];

        return mb_strtoupper(mb_substr($kata[0] ?? '', 0, 1).mb_substr($kata[1] ?? '', 0, 1));
    }
}
