<?php

namespace App\Contracts\Interfaces;

use App\Models\SiteContent;

interface SiteContentServiceInterface
{
    public function get(string $key): SiteContent;

    public function put(string $key, array $value): SiteContent;
}
