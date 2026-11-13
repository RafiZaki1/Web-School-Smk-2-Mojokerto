<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\AchievementRepositoryInterface;
use App\Contracts\Interfaces\AchievementServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Enums\UploadDirectoryEnum;
use Illuminate\Database\Eloquent\Model;

class AchievementService extends ContentService implements AchievementServiceInterface
{
    /** @var array<string, string> */
    protected array $fileFields = [
        'cover_image' => UploadDirectoryEnum::ACHIEVEMENTS->value,
        'student_photo' => UploadDirectoryEnum::ACHIEVEMENT_STUDENTS->value,
        'document' => UploadDirectoryEnum::ACHIEVEMENT_DOCUMENTS->value,
    ];

    /** @var array<string, string> */
    protected array $fileListFields = ['gallery' => UploadDirectoryEnum::ACHIEVEMENT_GALLERY->value];

    /**
     * Inisialisasi AchievementService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(AchievementRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    /**
     * Rapikan testimoni dan judul kartu. Testimoni tanpa kutipan dianggap kosong.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
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
