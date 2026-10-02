<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\SiteContentRepositoryInterface;
use App\Contracts\Interfaces\SiteContentServiceInterface;
use App\Models\SiteContent;

class SiteContentService implements SiteContentServiceInterface
{
    public function __construct(
        protected SiteContentRepositoryInterface $repository,
    ) {}

    public function get(string $key): SiteContent
    {
        return $this->repository->findByKeyOrFail($key);
    }

    public function put(string $key, array $value): SiteContent
    {
        return $this->repository->upsert($key, $value);
    }
}
