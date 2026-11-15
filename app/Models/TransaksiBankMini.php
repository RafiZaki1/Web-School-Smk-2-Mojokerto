<?php

namespace App\Models;

use App\Enums\BankMini\MetodeBayarEnum;
use App\Enums\BankMini\StatusTransaksiEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Satu pembayaran SPP (tunai atau gateway) yang bisa mencakup beberapa bulan.
 */
class TransaksiBankMini extends Model
{
    protected $table = 'transaksi_bank_mini';

    /** @var array<int, string> */
    protected $fillable = [
        'order_id',
        'reference',
        'siswa_id',
        'email_invoice',
        'metode',
        'channel',
        'channel_nama',
        'total_nominal',
        'porsi_spp',
        'porsi_tabungan',
        'biaya_admin',
        'status',
        'pay_code',
        'checkout_url',
        'expires_at',
        'paid_at',
        'petugas_id',
        'verifikator_id',
        'diverifikasi_at',
        'catatan_verifikasi',
        'gateway_payload',
    ];

    /** @var array<int, string> */
    protected $hidden = [
        'gateway_payload',
    ];

    /**
     * Atribut yang di-cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'metode' => MetodeBayarEnum::class,
            'status' => StatusTransaksiEnum::class,
            'total_nominal' => 'integer',
            'porsi_spp' => 'integer',
            'porsi_tabungan' => 'integer',
            'biaya_admin' => 'integer',
            'expires_at' => 'datetime',
            'paid_at' => 'datetime',
            'diverifikasi_at' => 'datetime',
            'gateway_payload' => 'array',
        ];
    }

    /**
     * Siswa yang membayar.
     *
     * @return BelongsTo
     */
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    /**
     * Petugas Bank Mini yang menerima pembayaran tunai.
     *
     * @return BelongsTo
     */
    public function petugas(): BelongsTo
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    /**
     * Petugas atau admin yang terakhir memutus transaksi ini (setujui, tolak, batalkan).
     *
     * @return BelongsTo
     */
    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verifikator_id');
    }

    /**
     * Baris rincian bulan transaksi ini.
     *
     * @return HasMany
     */
    public function detail(): HasMany
    {
        return $this->hasMany(TransaksiDetailBulan::class, 'transaksi_id');
    }

    /**
     * Tagihan bulan yang dibayar, urut Juli sampai Juni.
     *
     * @return BelongsToMany
     */
    public function tagihan(): BelongsToMany
    {
        return $this->belongsToMany(TagihanSpp::class, 'transaksi_detail_bulan', 'transaksi_id', 'tagihan_spp_id')
            ->withTimestamps()
            ->orderBy('tagihan_spp.tahun_ajaran')
            ->orderBy('tagihan_spp.urutan');
    }

    /**
     * Pembayaran sudah diterima.
     *
     * @return bool
     */
    public function isSettlement(): bool
    {
        return $this->status === StatusTransaksiEnum::SETTLEMENT;
    }

    /**
     * Transaksi gateway yang kode bayarnya masih berlaku.
     *
     * @return bool
     */
    public function bisaDilanjutkan(): bool
    {
        return $this->status === StatusTransaksiEnum::PENDING
            && $this->metode === MetodeBayarEnum::GATEWAY
            && $this->reference !== null
            && ($this->expires_at === null || $this->expires_at->isFuture());
    }

    /**
     * Total yang dibayar siswa termasuk biaya admin channel.
     *
     * @return int
     */
    public function totalBayar(): int
    {
        return $this->total_nominal + $this->biaya_admin;
    }

    /**
     * Langkah pembayaran dari Tripay yang disimpan saat transaksi dibuat.
     *
     * @return array<int, array{title: string, steps: array<int, string>}>
     */
    public function instruksi(): array
    {
        return array_values(array_filter(
            (array) ($this->gateway_payload['instructions'] ?? []),
            fn ($item) => is_array($item) && isset($item['title'], $item['steps']),
        ));
    }

    /**
     * Ringkasan bulan yang dibayar, mis. "Juli 2026, Agustus 2026". Butuh relasi tagihan.
     *
     * @return string
     */
    public function ringkasanBulan(): string
    {
        return $this->tagihan->map(fn (TagihanSpp $tagihan) => $tagihan->labelBulan())->join(', ');
    }
}
