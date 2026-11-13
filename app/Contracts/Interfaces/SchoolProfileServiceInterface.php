<?php

namespace App\Contracts\Interfaces;

use App\Models\SchoolProfile;

interface SchoolProfileServiceInterface
{
    /**
     * Kontrak method getProfile.
     *
     * @return ?SchoolProfile
     */
    public function getProfile(): ?SchoolProfile;

    /**
     * Kontrak method updateProfile.
     *
     * @param  array  $data
     * @return SchoolProfile
     */
    public function updateProfile(array $data): SchoolProfile;
}
