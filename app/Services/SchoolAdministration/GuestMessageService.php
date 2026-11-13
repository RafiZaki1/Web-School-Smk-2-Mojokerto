<?php

namespace App\Services\SchoolAdministration;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\GuestMessageRepositoryInterface;
use App\Contracts\Interfaces\GuestMessageServiceInterface;
use App\Enums\GuestMessageStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class GuestMessageService extends RecordService implements GuestMessageServiceInterface
{
    /**
     * Inisialisasi GuestMessageService dengan dependensi yang disuntikkan oleh service container.
     *
     * @param  GuestMessageRepositoryInterface  $repository
     * @param  FileUploadServiceInterface  $files
     */
    public function __construct(GuestMessageRepositoryInterface $repository, FileUploadServiceInterface $files)
    {
        parent::__construct($repository, $files);
    }

    /**
     * Catat waktu dibaca atau dibalas saat status pesan berubah.
     *
     * @param  array<string, mixed>  $data
     * @param  ?Model  $model
     * @return array<string, mixed>
     */
    protected function transform(array $data, ?Model $model): array
    {
        $status = $data['status'] ?? null;

        if ($status === GuestMessageStatusEnum::READ->value && ! $model?->read_at) {
            $data['read_at'] = Carbon::now();
        }

        if ($status === GuestMessageStatusEnum::REPLIED->value && ! $model?->replied_at) {
            $data['replied_at'] = Carbon::now();
            $data['read_at'] = $model?->read_at ?? Carbon::now();
        }

        return $data;
    }
}
