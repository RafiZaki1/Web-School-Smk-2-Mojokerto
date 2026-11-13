<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\GraduateRepositoryInterface;
use App\Contracts\Interfaces\GraduationServiceInterface;
use App\Contracts\Interfaces\GraduationSettingRepositoryInterface;
use App\Enums\GraduationReleaseModeEnum;
use App\Helpers\AcademicYearHelper;
use App\Models\Graduate;
use App\Models\GraduationSetting;
use Illuminate\Support\Carbon;

class GraduationService implements GraduationServiceInterface
{
    private const DEFAULT_CLOSED_MESSAGE = 'Pengumuman kelulusan belum dibuka. Pantau informasi resmi dari sekolah.';

    /**
     * Inisialisasi GraduationService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GraduationSettingRepositoryInterface  $settings
     * @param  GraduateRepositoryInterface  $graduates
     */
    public function __construct(
        protected GraduationSettingRepositoryInterface $settings,
        protected GraduateRepositoryInterface $graduates,
    ) {}

    /**
     * Ambil pengaturan kelulusan. Bila belum pernah disimpan, kembalikan nilai bawaan (mode draft).
     *
     * @return GraduationSetting
     */
    public function settings(): GraduationSetting
    {
        return $this->settings->current() ?? new GraduationSetting([
            'active_year' => AcademicYearHelper::graduationYear(),
            'release_mode' => GraduationReleaseModeEnum::DRAFT->value,
            'release_at' => null,
            'closed_message' => self::DEFAULT_CLOSED_MESSAGE,
        ]);
    }

    /**
     * Simpan sebagian pengaturan. Waktu rilis dikirim dengan zona waktu (ISO 8601) lalu disimpan dalam UTC.
     *
     * @param  array<string, mixed>  $data
     * @return GraduationSetting
     */
    public function updateSettings(array $data): GraduationSetting
    {
        $current = $this->settings();

        if (array_key_exists('release_at', $data)) {
            $data['release_at'] = $data['release_at'] ? Carbon::parse($data['release_at'])->utc()->format('Y-m-d H:i:s') : null;
        }

        return $this->settings->save([
            'active_year' => $current->active_year,
            'release_mode' => $current->release_mode,
            'release_at' => $current->release_at?->utc()->format('Y-m-d H:i:s'),
            'closed_message' => $current->closed_message,
            ...$data,
        ]);
    }

    /**
     * Status halaman Cek Kelulusan untuk pengunjung, termasuk sisa detik hitung mundur.
     *
     * @return array<string, mixed>
     */
    public function publicStatus(): array
    {
        $setting = $this->settings();
        $mode = $setting->mode();
        $now = Carbon::now();
        $timerRunning = $mode === GraduationReleaseModeEnum::TIMER && $setting->release_at?->isFuture();

        return [
            'mode' => $mode->value,
            'is_open' => $this->isOpen(),
            'active_year' => (int) $setting->active_year,
            'release_at' => $mode === GraduationReleaseModeEnum::TIMER ? $setting->release_at?->toISOString() : null,
            'seconds_until_release' => $timerRunning ? (int) $now->diffInSeconds($setting->release_at, true) : 0,
            'server_time' => $now->toISOString(),
            'closed_message' => $mode === GraduationReleaseModeEnum::DRAFT ? ($setting->closed_message ?: self::DEFAULT_CLOSED_MESSAGE) : null,
        ];
    }

    /**
     * Form cek kelulusan terbuka pada mode Buka Langsung, atau mode Timer yang waktunya sudah lewat.
     *
     * @return bool
     */
    public function isOpen(): bool
    {
        $setting = $this->settings();

        return match ($setting->mode()) {
            GraduationReleaseModeEnum::OPEN => true,
            GraduationReleaseModeEnum::TIMER => $setting->release_at !== null && ! $setting->release_at->isFuture(),
            GraduationReleaseModeEnum::DRAFT => false,
        };
    }

    /**
     * Cari hasil kelulusan siswa angkatan aktif dari NISN dan nama lengkap.
     *
     * @param  string  $nisn
     * @param  string  $fullName
     * @return ?Graduate
     */
    public function check(string $nisn, string $fullName): ?Graduate
    {
        return $this->graduates->findForCheck(trim($nisn), $fullName, (int) $this->settings()->active_year);
    }
}
