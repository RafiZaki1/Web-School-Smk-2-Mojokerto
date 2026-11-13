<?php

namespace App\Http\Controllers\LandingPage;

use App\Contracts\Interfaces\ArticleServiceInterface;
use App\Enums\ArticleCategoryEnum;
use App\Helpers\ResponseHelper;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\JsonResponse;
use Throwable;

class ArticlePublicController extends PublicContentController
{
    /** @var class-string */
    protected string $resource = ArticleResource::class;

    protected string $label = 'Berita';

    /**
     * Inisialisasi ArticlePublicController dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  ArticleServiceInterface  $service
     */
    public function __construct(ArticleServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Tampilkan daftar kategori untuk tab filter berita.
     *
     * @return JsonResponse
     */
    public function categories(): JsonResponse
    {
        try {
            return ResponseHelper::success(
                ArticleCategoryEnum::values(),
                trans('alert.fetch_success', ['resource' => 'Kategori berita'])
            );
        } catch (Throwable $th) {
            return $this->writeError($th);
        }
    }
}
