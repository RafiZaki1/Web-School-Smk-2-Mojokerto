<?php

namespace App\Contracts\Interfaces;

use App\Enums\BankMini\StatusTagihanEnum;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;

/**
 * Tagihan SPP bulanan siswa.
 */
interface TagihanSppRepositoryInterface
{
    /**
     * Kontrak method insertIgnore.
     *
     * @param  array<int, array<string, mixed>>  $rows
     * @return int
     */
    public function insertIgnore(array $rows): int;

    /**
     * Kontrak method milikSiswa.
     *
     * @param  int  $siswaId
     * @param  string  $tahunAjaran
     * @return Collection
     */
    public function milikSiswa(int $siswaId, string $tahunAjaran): Collection;

    /**
     * Kontrak method milikBanyakSiswa.
     *
     * @param  array<int, int>  $siswaIds
     * @param  string  $tahunAjaran
     * @return Collection
     */
    public function milikBanyakSiswa(array $siswaIds, string $tahunAjaran): Collection;

    /**
     * Kontrak method bisaDibayar.
     *
     * @param  array<int, int>  $ids
     * @param  int  $siswaId
     * @return Collection
     */
    public function bisaDibayar(array $ids, int $siswaId): Collection;

    /**
     * Kontrak method tahunAjaranSiswa.
     *
     * @param  int  $siswaId
     * @return array<int, string>
     */
    public function tahunAjaranSiswa(int $siswaId): array;

    /**
     * Kontrak method tahunAjaranTersedia.
     *
     * @return array<int, string>
     */
    public function tahunAjaranTersedia(): array;

    /**
     * Kontrak method tandaiPending.
     *
     * @param  array<int, int>  $ids
     * @param  int  $siswaId
     * @return int
     */
    public function tandaiPending(array $ids, int $siswaId): int;

    /**
     * Kontrak method lunasiTunai.
     *
     * @param  array<int, int>  $ids
     * @param  int  $siswaId
     * @return int
     */
    public function lunasiTunai(array $ids, int $siswaId): int;

    /**
     * Kontrak method pindahStatus.
     *
     * @param  array<int, int>  $ids
     * @param  array<int, StatusTagihanEnum>  $dari
     * @param  StatusTagihanEnum  $ke
     * @return int
     */
    public function pindahStatus(array $ids, array $dari, StatusTagihanEnum $ke): int;

    /**
     * Kontrak method rekapPerKelas.
     *
     * @param  string  $tahunAjaran
     * @return SupportCollection
     */
    public function rekapPerKelas(string $tahunAjaran): SupportCollection;
}
