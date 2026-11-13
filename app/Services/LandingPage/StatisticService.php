<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\StatisticRepositoryInterface;
use App\Contracts\Interfaces\StatisticServiceInterface;

class StatisticService implements StatisticServiceInterface
{
    /**
     * Inisialisasi StatisticService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected StatisticRepositoryInterface $statisticRepository,
    ) {}

    /**
     * Ambil statistik sekolah: jumlah siswa, guru, jurusan, alumni, dan tahun berdiri.
     *
     * @return array<string, int|null>
     */
    public function getStatistics(): array
    {
        $counts = $this->statisticRepository->getCounts();

        return [
            ...$counts,
            'established_year' => $this->statisticRepository->establishedYear(),
        ];
    }
}
