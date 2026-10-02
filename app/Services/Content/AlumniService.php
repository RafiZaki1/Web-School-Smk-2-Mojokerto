<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\AlumniRepositoryInterface;
use App\Contracts\Interfaces\AlumniServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Models\Alumni;
use App\Services\Concerns\ManagesMedia;
use Illuminate\Database\Eloquent\Collection;

class AlumniService implements AlumniServiceInterface
{
    use ManagesMedia;

    public function __construct(
        protected AlumniRepositoryInterface $repository,
        protected FileUploadServiceInterface $files,
    ) {}

    public function getList(bool $featuredOnly = false): Collection
    {
        return $this->repository->list($featuredOnly);
    }

    public function getById(int|string $id): Alumni
    {
        return $this->repository->findOrFail($id);
    }

    public function create(array $data): Alumni
    {
        if (array_key_exists('photo', $data)) {
            $data['photo'] = $this->storeFile($data['photo'], 'alumni');
        }

        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): Alumni
    {
        $alumni = $this->getById($id);

        if (array_key_exists('photo', $data)) {
            $data['photo'] = $this->storeFile($data['photo'], 'alumni', $alumni->photo);
        }

        return $this->repository->update($alumni, $data);
    }

    public function delete(int|string $id): bool
    {
        $alumni = $this->getById($id);
        $this->deleteStored($alumni->photo);

        return $this->repository->delete($alumni);
    }
}
