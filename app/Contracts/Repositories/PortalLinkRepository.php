<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\PortalLinkRepositoryInterface;
use App\Models\PortalLink;
use Illuminate\Database\Eloquent\Builder;

class PortalLinkRepository extends BaseRepository implements PortalLinkRepositoryInterface
{
    /** @var class-string<PortalLink> */
    protected string $model = PortalLink::class;

    /**
     * Pintasan yang tampil di navbar adalah pintasan aktif.
     */
    protected function onlyPublished(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
