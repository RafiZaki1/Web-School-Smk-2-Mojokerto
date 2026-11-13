<?php

namespace App\Models;

use App\Enums\BankMini\StatusTagihanEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Tagihan SPP satu bulan untuk satu siswa. Kolom bulan = nomor bulan kalender,
 * kolom urutan = posisi dalam tahun ajaran (1 = Juli ... 12 = Juni).
 */
class TagihanSpp extends Model
{
    protected $table = 'tagihan_spp';

    /** @var array<int, string> */
    protected $fillable = [
        'siswa_id',
        'tahun_ajaran',
        'bulan',
        'urutan',
        'nama_bulan',
        'nominal_spp',
        'nominal_tabungan',
        'status',
        'jatuh_tempo',
        'lunas_at',
    ];

    /**
     * Atribut yang di-cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'bulan' => 'integer',
            'urutan' => 'integer',
            'nominal_spp' => 'integer',
            'nominal_tabungan' => 'integer',
            'status' => StatusTagihanEnum::class,
            'jatuh_tempo' => 'date',
            'lunas_at' => 'datetime',
        ];
    }

    /**
     * Siswa pemilik tagihan.
     *
     * @return BelongsTo
     */
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    /**
     * Transaksi yang pernah memuat bulan ini.
     *
     * @return BelongsToMany
     */
    public function transaksi(): BelongsToMany
    {
        return $this->belongsToMany(TransaksiBankMini::class, 'transaksi_detail_bulan', 'tagihan_spp_id', 'transaksi_id')
            ->withTimestamps();
    }

    /**
     * Total iuran bulan ini (SPP + tabungan).
     *
     * @return int
     */
    public function total(): int
    {
        return $this->nominal_spp + $this->nominal_tabungan;
    }

    /**
     * Status yang dilihat pengguna: belum_lunas dipecah menjadi "menunggak"
     * (lewat jatuh tempo) dan "belum_jatuh_tempo".
     *
     * @return string
     */
    public function statusTampil(): string
    {
        return match ($this->status) {
            StatusTagihanEnum::LUNAS => 'lunas',
            StatusTagihanEnum::PENDING => 'pending',
            StatusTagihanEnum::BELUM_LUNAS => $this->jatuh_tempo->lt(today('Asia/Jakarta')->toDateString()) ? 'menunggak' : 'belum_jatuh_tempo',
        };
    }

    /**
     * Bulan ini bisa dipilih untuk dibayar.
     *
     * @return bool
     */
    public function bisaDibayar(): bool
    {
        return $this->status === StatusTagihanEnum::BELUM_LUNAS;
    }

    /**
     * Label bulan lengkap dengan tahun kalender, mis. "Juli 2026".
     *
     * @return string
     */
    public function labelBulan(): string
    {
        return $this->nama_bulan.' '.$this->jatuh_tempo->year;
    }
}
