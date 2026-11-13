<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\WaliKelasRepositoryInterface;
use App\Models\WaliKelas;
use Illuminate\Database\Eloquent\Collection;

class WaliKelasRepository extends BaseRepository implements WaliKelasRepositoryInterface
{
    /** @var class-string<WaliKelas> */
    protected string $model = WaliKelas::class;

    /**
     * Seluruh penautan wali kelas beserta akun dan data gurunya, di-key dengan nama kelas.
     *
     * @return Collection
     */
    public function semuaPerKelas(): Collection
    {
        return $this->query()
            ->with(['user:id,name,username', 'teacher:id,name'])
            ->get()
            ->keyBy('kelas');
    }

    /**
     * Wali kelas suatu kelas beserta akunnya.
     *
     * @param  string  $kelas
     * @return ?WaliKelas
     */
    public function findByKelas(string $kelas): ?WaliKelas
    {
        return $this->query()->with(['user', 'teacher:id,name'])->where('kelas', $kelas)->first();
    }

    /**
     * Penautan milik akun yang sedang login.
     *
     * @param  int  $userId
     * @return ?WaliKelas
     */
    public function findByUser(int $userId): ?WaliKelas
    {
        return $this->query()->with('teacher:id,name')->where('user_id', $userId)->first();
    }
}
