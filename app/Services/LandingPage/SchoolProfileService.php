<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\SchoolProfileRepositoryInterface;
use App\Contracts\Interfaces\SchoolProfileServiceInterface;
use App\Enums\UploadDirectoryEnum;
use App\Models\SchoolProfile;
use Illuminate\Http\UploadedFile;

class SchoolProfileService implements SchoolProfileServiceInterface
{
    /** @var array<int, string> */
    private const IMAGE_FIELDS = ['school_logo', 'principal_photo', 'background_image'];

    /**
     * Inisialisasi SchoolProfileService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected FileUploadServiceInterface $fileUploadService,
        protected SchoolProfileRepositoryInterface $schoolProfileRepository,
    ) {}

    /**
     * Ambil satu-satunya profil sekolah.
     */
    public function getProfile(): ?SchoolProfile
    {
        return $this->schoolProfileRepository->first();
    }

    /**
     * Perbarui profil sekolah, atau buat baru bila belum ada, sekaligus mengganti gambar yang diunggah ulang.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateProfile(array $data): SchoolProfile
    {
        $profile = $this->getProfile();

        foreach (self::IMAGE_FIELDS as $field) {
            if (isset($data[$field]) && $data[$field] instanceof UploadedFile) {
                $data[$field] = $this->fileUploadService->replace(
                    $data[$field],
                    $profile?->{$field},
                    UploadDirectoryEnum::SCHOOL_PROFILES->value
                );
            }
        }

        return $this->schoolProfileRepository->updateOrCreate($profile, $data);
    }
}
