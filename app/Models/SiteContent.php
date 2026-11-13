<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    /** @var array<int, string> */
    protected $fillable = [
        'key',
        'value',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'value' => 'array',
    ];
}
