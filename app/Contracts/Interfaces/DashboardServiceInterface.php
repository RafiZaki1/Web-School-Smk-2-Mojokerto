<?php

namespace App\Contracts\Interfaces;

interface DashboardServiceInterface
{
    /**
     * Ringkasan panel admin: jumlah konten, draf, kuis jurusan baru, dan aktivitas terbaru.
     */
    public function summary(): array;
}
