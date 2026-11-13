<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class GuestVisit extends Model
{
    /** @var array<int, string> */
    protected $fillable = [
        'visitor_name',
        'institution',
        'phone',
        'purpose',
        'visit_date',
        'visit_time',
        'participants',
        'person_to_meet',
        'status',
        'note',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'visit_date' => 'date:Y-m-d',
        'participants' => 'integer',
    ];

    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        return $status ? $query->where('status', $status) : $query;
    }

    /**
     * Kunjungan hari ini dan sesudahnya, terdekat lebih dulu.
     */
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->whereDate('visit_date', '>=', Carbon::today())
            ->orderBy('visit_date')
            ->orderBy('visit_time');
    }
}
