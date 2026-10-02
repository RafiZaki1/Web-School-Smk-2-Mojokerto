<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\AchievementRepositoryInterface;
use App\Contracts\Interfaces\AchievementServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use Illuminate\Database\Eloquent\Model;

class AchievementService extends ContentService implements AchievementServiceInterface
{
    protected array $fileFields = [
        'cover_image' => 'achievements',
        'student_photo' => 'achievements/students',
        'document' => 'achievements/documents',
    ];

    protected array $fileListFields = ['gallery' => 'achievements/gallery'];

    public function __construct(AchievementRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    protected function transform(array $data, ?Model $model): array
    {
        if (array_key_exists('testimonial', $data)) {
            $testimonial = array_map(fn ($value) => is_string($value) ? trim($value) : $value, $data['testimonial'] ?? []);
            $data['testimonial'] = ! empty($testimonial['quote'])
                ? [
                    'quote' => $testimonial['quote'],
                    'name' => $testimonial['name'] ?? null,
                    'position' => $testimonial['position'] ?? null,
                ]
                : null;
        }

        if (array_key_exists('card_title', $data) && trim((string) $data['card_title']) === '') {
            $data['card_title'] = null;
        }

        return $data;
    }
}
