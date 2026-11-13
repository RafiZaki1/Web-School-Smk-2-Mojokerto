<?php

namespace App\Models;

use App\Enums\WeekdayEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class UniformSchedule extends Model
{
    /** @var array<int, string> */
    protected $fillable = [
        'day',
        'name',
        'description',
        'image',
    ];

    /**
     * Urutkan Senin sampai Jumat.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        $cases = collect(WeekdayEnum::cases());
        $sql = 'CASE day '.$cases->map(fn () => 'WHEN ? THEN ?')->implode(' ').' ELSE 99 END';
        $bindings = $cases->flatMap(fn (WeekdayEnum $day) => [$day->value, $day->order()])->all();

        return $query->orderByRaw($sql, $bindings);
    }
}
