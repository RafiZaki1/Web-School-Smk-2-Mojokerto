<?php

namespace App\Models;

use App\Enums\MajorCodeEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class PracticeUniform extends Model
{
    /** @var array<int, string> */
    protected $fillable = [
        'major_code',
        'name',
        'description',
        'image',
    ];

    /**
     * Urutkan mengikuti urutan MajorCodeEnum.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        $codes = MajorCodeEnum::values();
        $sql = 'CASE major_code '.implode(' ', array_fill(0, count($codes), 'WHEN ? THEN ?')).' ELSE 99 END';
        $bindings = collect($codes)->flatMap(fn (string $code, int $i) => [$code, $i])->all();

        return $query->orderByRaw($sql, $bindings);
    }
}
