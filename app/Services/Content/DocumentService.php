<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\DocumentRepositoryInterface;
use App\Contracts\Interfaces\DocumentServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Enums\UploadDirectoryEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class DocumentService extends ContentService implements DocumentServiceInterface
{
    /** @var array<string, string> */
    protected array $fileFields = ['file' => UploadDirectoryEnum::DOCUMENTS->value];

    /**
     * Inisialisasi DocumentService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected DocumentRepositoryInterface $documents,
        FileUploadServiceInterface $files,
    ) {
        parent::__construct($documents, $files);
    }

    /**
     * Catat satu unduhan berkas dan kembalikan datanya.
     */
    public function recordDownload(int|string $identifier): Model
    {
        $document = $this->getPublishedByIdentifier($identifier);
        $this->documents->incrementDownloads($document);

        return $document;
    }

    /**
     * Catat ukuran dan jenis berkas sebelum berkas diganti dengan path penyimpanan.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function prepare(array $data, ?Model $model = null): array
    {
        if (($data['file'] ?? null) instanceof UploadedFile) {
            $data['file_size'] = $data['file']->getSize();
            $data['file_type'] = strtolower($data['file']->getClientOriginalExtension());
        } elseif (array_key_exists('file', $data) && ! $data['file']) {
            $data['file_size'] = null;
            $data['file_type'] = null;
        }

        return parent::prepare($data, $model);
    }
}
