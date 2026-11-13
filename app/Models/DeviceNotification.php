<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceNotification extends Model
{
    /** @var array<int, string> */
    protected $fillable = [
        'device_token',
        'alumni_service_request_id',
        'title',
        'body',
        'url',
        'pushed_at',
        'read_at',
    ];

    /** @var array<int, string> */
    protected $hidden = [
        'device_token',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'pushed_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(AlumniServiceRequest::class, 'alumni_service_request_id');
    }

    public function scopeForDevice(Builder $query, string $deviceToken): Builder
    {
        return $query->where('device_token', $deviceToken);
    }

    public function scopeUnread(Builder $query): Builder
    {
        return $query->whereNull('read_at');
    }
}
