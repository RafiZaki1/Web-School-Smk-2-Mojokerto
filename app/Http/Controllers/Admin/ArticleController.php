<?php

namespace App\Http\Controllers\Admin;

use App\Contracts\Interfaces\ArticleServiceInterface;
use App\Http\Requests\ArticleRequest;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\JsonResponse;

class ArticleController extends AdminContentController
{
    /** @var class-string */
    protected string $resource = ArticleResource::class;

    protected string $label = 'Berita';

    /**
     * Inisialisasi ArticleController dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(ArticleServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Simpan berita baru.
     */
    public function store(ArticleRequest $request): JsonResponse
    {
        return $this->storeFrom($request);
    }

    /**
     * Perbarui berita.
     */
    public function update(ArticleRequest $request, string $id): JsonResponse
    {
        return $this->updateFrom($request, $id);
    }
}
