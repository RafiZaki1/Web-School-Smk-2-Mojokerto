<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aspiration extends Model
{
    use HasFactory;

    public const CATEGORIES = ['Fasilitas', 'Pembelajaran', 'Kedisiplinan', 'Layanan Administrasi', 'Lainnya'];

    public const STATUS_NEW = 'new';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_RESOLVED = 'resolved';

    public const STATUSES = [self::STATUS_NEW, self::STATUS_IN_PROGRESS, self::STATUS_RESOLVED];

    protected $fillable = [
        'category',
        'title',
        'detail',
        'photos',
        'is_anonymous',
        'sender_name',
        'status',
        'admin_note',
        'public_response',
        'responded_at',
    ];

    protected $casts = [
        'photos' => 'array',
        'is_anonymous' => 'boolean',
        'responded_at' => 'datetime',
    ];

    /** Aspirasi yang sudah direspons sekolah dan boleh tampil di halaman publik. */
    public function scopeFollowedUp(Builder $query): Builder
    {
        return $query->whereIn('status', [self::STATUS_IN_PROGRESS, self::STATUS_RESOLVED]);
    }

    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('created_at')->orderByDesc('id');
    }
}
