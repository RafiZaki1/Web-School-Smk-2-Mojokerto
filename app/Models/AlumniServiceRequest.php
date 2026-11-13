<?php

namespace App\Models;

use App\Enums\AlumniServiceStatusEnum;
use App\Observers\AlumniServiceRequestObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[ObservedBy(AlumniServiceRequestObserver::class)]
class AlumniServiceRequest extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'ticket_code',
        'device_token',
        'nisn',
        'full_name',
        'graduation_year',
        'class_name',
        'major_code',
        'service_type',
        'purpose',
        'phone',
        'status',
        'admin_note',
        'processed_at',
        'approved_at',
        'completed_at',
    ];

    /** @var array<int, string> */
    protected $hidden = [
        'device_token',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'graduation_year' => 'integer',
        'processed_at' => 'datetime',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Notifikasi lonceng yang lahir dari pengajuan ini.
     *
     * @return HasMany
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(DeviceNotification::class);
    }

    /**
     * Pengajuan milik satu perangkat.
     *
     * @param  Builder  $query
     * @param  string  $deviceToken
     * @return Builder
     */
    public function scopeForDevice(Builder $query, string $deviceToken): Builder
    {
        return $query->where('device_token', $deviceToken);
    }

    public function scopeForClass(Builder $query, ?string $className): Builder
    {
        return $className ? $query->where('class_name', $className) : $query;
    }

    public function scopeForMajor(Builder $query, ?string $majorCode): Builder
    {
        return $majorCode ? $query->where('major_code', $majorCode) : $query;
    }

    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        return $status ? $query->where('status', $status) : $query;
    }

    /**
     * Urutan antrean kerja TU: yang menunggu dan diproses di atas, lalu yang paling lama masuk.
     *
     * @param  Builder  $query
     * @return Builder
     */
    public function scopeQueue(Builder $query): Builder
    {
        return $query
            ->orderByRaw('CASE status WHEN ? THEN 0 WHEN ? THEN 1 WHEN ? THEN 2 ELSE 3 END', [
                AlumniServiceStatusEnum::PENDING->value,
                AlumniServiceStatusEnum::PROCESSING->value,
                AlumniServiceStatusEnum::APPROVED->value,
            ])
            ->orderBy('created_at')
            ->orderBy('id');
    }

    /**
     * Baris yang berubah sejak waktu tertentu, untuk sinkronisasi polling antar perangkat.
     *
     * @param  Builder  $query
     * @param  ?string  $since
     * @return Builder
     */
    public function scopeChangedSince(Builder $query, ?string $since): Builder
    {
        return $since ? $query->where('updated_at', '>=', $since) : $query;
    }
}
