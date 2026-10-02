<?php

namespace App\Http\Controllers\Api\Admin;

use App\Contracts\Interfaces\ArticleServiceInterface;
use App\Http\Requests\Content\ArticleRequest;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\JsonResponse;

class ArticleController extends AdminContentController
{
    protected string $resource = ArticleResource::class;

    protected string $label = 'Berita';

    public function __construct(ArticleServiceInterface $service)
    {
        $this->service = $service;
    }

    public function store(ArticleRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    public function update(ArticleRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
