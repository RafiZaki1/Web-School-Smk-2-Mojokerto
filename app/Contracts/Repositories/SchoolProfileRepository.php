<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\SchoolProfileRepositoryInterface;
use App\Models\SchoolProfile;

class SchoolProfileRepository implements SchoolProfileRepositoryInterface
{
    /**
     * Ambil satu-satunya profil sekolah.
     */
    public function first(): ?SchoolProfile
    {
        return SchoolProfile::query()->first();
    }

    /**
     * Perbarui profil yang ada, atau buat baru bila belum ada.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateOrCreate(?SchoolProfile $profile, array $data): SchoolProfile
    {
        if ($profile) {
            $profile->update($data);

            return $profile->refresh();
        }

        return SchoolProfile::query()->create($data);
    }
}
