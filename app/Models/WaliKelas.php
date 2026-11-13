<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Penautan akun wali kelas ke satu kelas (lihat SchoolClassEnum).
 */
class WaliKelas extends Model
{
    protected $table = 'wali_kelas';

    /** @var array<int, string> */
    protected $fillable = [
        'kelas',
        'user_id',
        'teacher_id',
    ];

    /**
     * Akun login wali kelas.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Data guru yang tampil di web sekolah, bila ditautkan.
     *
     * @return BelongsTo
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
