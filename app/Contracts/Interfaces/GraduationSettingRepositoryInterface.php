<?php

namespace App\Contracts\Interfaces;

use App\Models\GraduationSetting;

/**
 * Pengaturan tunggal pengumuman kelulusan.
 */
interface GraduationSettingRepositoryInterface
{
    /**
     * Kontrak method current.
     *
     * @return ?GraduationSetting
     */
    public function current(): ?GraduationSetting;

    /**
     * Kontrak method save.
     *
     * @param  array<string, mixed>  $data
     * @return GraduationSetting
     */
    public function save(array $data): GraduationSetting;
}
