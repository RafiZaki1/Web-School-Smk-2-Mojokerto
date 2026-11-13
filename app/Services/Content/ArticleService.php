<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\ArticleRepositoryInterface;
use App\Contracts\Interfaces\ArticleServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Enums\UploadDirectoryEnum;
use Illuminate\Database\Eloquent\Model;

class ArticleService extends ContentService implements ArticleServiceInterface
{
    /** @var array<string, string> */
    protected array $fileFields = ['cover_image' => UploadDirectoryEnum::ARTICLES->value];

    /** @var array<string, string> */
    protected array $fileListFields = ['gallery' => UploadDirectoryEnum::ARTICLE_GALLERY->value];

    /**
     * Inisialisasi ArticleService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(ArticleRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    /**
     * Isi tanggal terbit hari ini untuk berita baru dan penulis default bila kosong.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function transform(array $data, ?Model $model): array
    {
        if (! $model && empty($data['published_at'])) {
            $data['published_at'] = now()->toDateString();
        }

        if (array_key_exists('author', $data) && trim((string) $data['author']) === '') {
            $data['author'] = 'Admin Sekolah';
        }

        return $data;
    }
}
