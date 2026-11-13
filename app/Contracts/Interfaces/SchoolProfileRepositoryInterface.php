<?php

namespace App\Contracts\Interfaces;

use App\Models\SchoolProfile;

interface SchoolProfileRepositoryInterface
{
    /**
     * Kontrak method first.
     *
     * @return ?SchoolProfile
     */
    public function first(): ?SchoolProfile;

    /**
     * Kontrak method updateOrCreate.
     *
     * @param  ?SchoolProfile  $profile
     * @param  array  $data
     * @return SchoolProfile
     */
    public function updateOrCreate(?SchoolProfile $profile, array $data): SchoolProfile;
}
