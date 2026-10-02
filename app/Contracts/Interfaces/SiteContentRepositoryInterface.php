<?php

namespace App\Contracts\Interfaces;

use App\Models\SiteContent;

interface SiteContentRepositoryInterface
{
    public function findByKeyOrFail(string $key): SiteContent;

    public function upsert(string $key, array $value): SiteContent;
}
