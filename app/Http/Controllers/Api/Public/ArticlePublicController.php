<?php

namespace App\Http\Controllers\Api\Public;

use App\Contracts\Interfaces\ArticleServiceInterface;
use App\Helpers\ApiResponse;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;

class ArticlePublicController extends PublicContentController
{
    protected string $resource = ArticleResource::class;

    protected string $label = 'Berita';

    public function __construct(ArticleServiceInterface $service)
    {
        $this->service = $service;
    }

    /** Daftar kategori untuk tab filter berita. */
    public function categories(): JsonResponse
    {
        return ApiResponse::success(Article::CATEGORIES, 'Kategori berita berhasil dimuat');
    }
}
