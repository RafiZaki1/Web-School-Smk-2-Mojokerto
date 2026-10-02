<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\SiteContentRepositoryInterface;
use App\Models\SiteContent;

class SiteContentRepository implements SiteContentRepositoryInterface
{
    public function findByKeyOrFail(string $key): SiteContent
    {
        return SiteContent::query()->where('key', $key)->firstOrFail();
    }

    public function upsert(string $key, array $value): SiteContent
    {
        return SiteContent::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
