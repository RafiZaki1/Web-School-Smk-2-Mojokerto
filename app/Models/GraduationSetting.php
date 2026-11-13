<?php

namespace App\Models;

use App\Enums\GraduationReleaseModeEnum;
use Illuminate\Database\Eloquent\Model;

/**
 * Pengaturan tunggal pengumuman kelulusan. Perhitungan buka/tutup ada di GraduationService.
 */
class GraduationSetting extends Model
{
    /** @var array<int, string> */
    protected $fillable = [
        'active_year',
        'release_mode',
        'release_at',
        'closed_message',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'active_year' => 'integer',
        'release_at' => 'datetime',
    ];

    /**
     * Mode rilis dalam bentuk enum; nilai tak dikenal dianggap draft.
     *
     * @return GraduationReleaseModeEnum
     */
    public function mode(): GraduationReleaseModeEnum
    {
        return GraduationReleaseModeEnum::tryFrom((string) $this->release_mode) ?? GraduationReleaseModeEnum::DRAFT;
    }
}
