<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\GraduationSettingRepositoryInterface;
use App\Models\GraduationSetting;

class GraduationSettingRepository extends BaseRepository implements GraduationSettingRepositoryInterface
{
    /** @var class-string<GraduationSetting> */
    protected string $model = GraduationSetting::class;

    /** Tabel ini hanya punya satu baris pengaturan. */
    private const SETTING_ID = 1;

    /**
     * Ambil baris pengaturan kelulusan, atau null bila belum pernah disimpan.
     *
     * @return ?GraduationSetting
     */
    public function current(): ?GraduationSetting
    {
        return $this->query()->find(self::SETTING_ID);
    }

    /**
     * Simpan pengaturan ke baris tunggal (id 1). upsert menjaga agar baris tidak pernah dobel.
     *
     * @param  array<string, mixed>  $data
     * @return GraduationSetting
     */
    public function save(array $data): GraduationSetting
    {
        $now = now();
        $this->query()->upsert(
            [[...$data, 'id' => self::SETTING_ID, 'created_at' => $now, 'updated_at' => $now]],
            ['id'],
            [...array_keys($data), 'updated_at'],
        );

        /** @var GraduationSetting */
        return $this->query()->findOrFail(self::SETTING_ID);
    }
}
