<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\ArticleRepositoryInterface;
use App\Contracts\Interfaces\ArticleServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use Illuminate\Database\Eloquent\Model;

class ArticleService extends ContentService implements ArticleServiceInterface
{
    protected array $fileFields = ['cover_image' => 'articles'];

    protected array $fileListFields = ['gallery' => 'articles/gallery'];

    public function __construct(ArticleRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    protected function transform(array $data, ?Model $model): array
    {
        // Berita baru tanpa tanggal dianggap terbit hari ini
        if (! $model && empty($data['published_at'])) {
            $data['published_at'] = now()->toDateString();
        }

        if (array_key_exists('author', $data) && trim((string) $data['author']) === '') {
            $data['author'] = 'Admin Sekolah';
        }

        return $data;
    }
}
