<?php

namespace App\Models;

use App\Observers\PushSubscriptionObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy(PushSubscriptionObserver::class)]
class PushSubscription extends Model
{
    /** @var array<int, string> */
    protected $fillable = [
        'device_token',
        'endpoint',
        'endpoint_hash',
        'public_key',
        'auth_token',
        'content_encoding',
        'user_agent',
        'last_used_at',
    ];

    /** @var array<int, string> */
    protected $hidden = [
        'endpoint',
        'endpoint_hash',
        'public_key',
        'auth_token',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'last_used_at' => 'datetime',
    ];

    /**
     * Hash SHA-256 endpoint, dipakai sebagai kunci unik langganan.
     *
     * @param  string  $endpoint
     * @return string
     */
    public static function hashEndpoint(string $endpoint): string
    {
        return hash('sha256', $endpoint);
    }

    /**
     * Langganan milik satu perangkat.
     *
     * @param  Builder  $query
     * @param  string  $deviceToken
     * @return Builder
     */
    public function scopeForDevice(Builder $query, string $deviceToken): Builder
    {
        return $query->where('device_token', $deviceToken);
    }
}
