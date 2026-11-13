<?php

namespace App\Contracts\Interfaces;

use App\Models\SiteContent;

interface SiteContentRepositoryInterface
{
    /**
     * Kontrak method findByKey.
     *
     * @param  string  $key
     * @return ?SiteContent
     */
    public function findByKey(string $key): ?SiteContent;

    /**
     * Kontrak method findByKeyOrFail.
     *
     * @param  string  $key
     * @return SiteContent
     */
    public function findByKeyOrFail(string $key): SiteContent;

    /**
     * Kontrak method upsert.
     *
     * @param  string  $key
     * @param  array  $value
     * @return SiteContent
     */
    public function upsert(string $key, array $value): SiteContent;
}
