<?php

namespace App\Contracts\Interfaces;

use App\Models\Graduate;
use App\Models\GraduationSetting;

/**
 * Pengumuman kelulusan: pengaturan mode rilis (draft, timer, buka langsung) dan pengecekan NISN.
 */
interface GraduationServiceInterface
{
    /**
     * Kontrak method settings.
     *
     * @return GraduationSetting
     */
    public function settings(): GraduationSetting;

    /**
     * Kontrak method updateSettings.
     *
     * @param  array<string, mixed>  $data
     * @return GraduationSetting
     */
    public function updateSettings(array $data): GraduationSetting;

    /**
     * Kontrak method publicStatus.
     *
     * @return array<string, mixed>
     */
    public function publicStatus(): array;

    /**
     * Kontrak method isOpen.
     *
     * @return bool
     */
    public function isOpen(): bool;

    /**
     * Kontrak method check.
     *
     * @param  string  $nisn
     * @param  string  $fullName
     * @return ?Graduate
     */
    public function check(string $nisn, string $fullName): ?Graduate;
}
