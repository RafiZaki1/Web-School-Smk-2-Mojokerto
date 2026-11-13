<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\SiteContentRepositoryInterface;
use App\Models\SiteContent;

class SiteContentRepository implements SiteContentRepositoryInterface
{
    /**
     * Cari konten berdasarkan kunci, atau null bila belum ada.
     */
    public function findByKey(string $key): ?SiteContent
    {
        return SiteContent::query()->where('key', $key)->first();
    }

    /**
     * Cari konten berdasarkan kunci, atau gagal.
     */
    public function findByKeyOrFail(string $key): SiteContent
    {
        return SiteContent::query()->where('key', $key)->firstOrFail();
    }

    /**
     * Simpan nilai konten berdasarkan kunci; buat baru bila belum ada.
     *
     * @param  array<string, mixed>  $value
     */
    public function upsert(string $key, array $value): SiteContent
    {
        return SiteContent::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
