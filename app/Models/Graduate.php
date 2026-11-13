<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Graduate extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'nisn',
        'full_name',
        'birth_date',
        'class_name',
        'major_code',
        'graduation_year',
        'status',
        'administration_status',
        'note',
        'is_archived',
        'archived_at',
    ];

    /** @var array<int, string> */
    protected $hidden = [
        'birth_date',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'birth_date' => 'date:Y-m-d',
        'graduation_year' => 'integer',
        'is_archived' => 'boolean',
        'archived_at' => 'datetime',
    ];

    /**
     * Siswa angkatan aktif (belum diarsipkan) pada tahun lulus tertentu.
     */
    public function scopeActiveYear(Builder $query, int $year): Builder
    {
        return $query->where('graduation_year', $year)->where('is_archived', false);
    }

    /**
     * Lulusan yang sudah diarsipkan dan tampil di Direktori Lulusan publik.
     */
    public function scopeArchived(Builder $query): Builder
    {
        return $query->where('is_archived', true);
    }

    /**
     * Saring per kelas bila kelas diisi.
     */
    public function scopeForClass(Builder $query, ?string $className): Builder
    {
        return $className ? $query->where('class_name', $className) : $query;
    }

    /**
     * Saring per jurusan bila jurusan diisi.
     */
    public function scopeForMajor(Builder $query, ?string $majorCode): Builder
    {
        return $majorCode ? $query->where('major_code', $majorCode) : $query;
    }

    /**
     * Cari berdasarkan NISN atau nama.
     */
    public function scopeSearch(Builder $query, ?string $keyword): Builder
    {
        $keyword = trim((string) $keyword);

        if ($keyword === '') {
            return $query;
        }

        return $query->where(function (Builder $q) use ($keyword) {
            $q->where('nisn', 'like', "{$keyword}%")
                ->orWhere('full_name', 'like', "%{$keyword}%");
        });
    }

    /**
     * Urutkan per kelas lalu nama.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('class_name')->orderBy('full_name');
    }
}
