<?php

namespace App\Services\Content;

use App\Contracts\Interfaces\AspirationRepositoryInterface;
use App\Contracts\Interfaces\AspirationServiceInterface;
use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Models\Aspiration;
use App\Services\Concerns\ManagesMedia;
use Illuminate\Database\Eloquent\Collection;

class AspirationService implements AspirationServiceInterface
{
    use ManagesMedia;

    public function __construct(
        protected AspirationRepositoryInterface $repository,
        protected FileUploadServiceInterface $files,
    ) {}

    public function getFollowedUp(int $limit = 10): Collection
    {
        return $this->repository->followedUp($limit);
    }

    /** Kiriman dari formulir publik selalu berstatus baru. */
    public function submit(array $data): Aspiration
    {
        $anonymous = (bool) ($data['is_anonymous'] ?? true);

        return $this->repository->create([
            'category' => $data['category'],
            'title' => trim($data['title']),
            'detail' => trim($data['detail']),
            'photos' => $this->storeFileList($data['photos'] ?? [], 'aspirations'),
            'is_anonymous' => $anonymous,
            'sender_name' => $anonymous ? null : (trim((string) ($data['sender_name'] ?? '')) ?: null),
            'status' => Aspiration::STATUS_NEW,
        ]);
    }

    public function getAll(): Collection
    {
        return $this->repository->all();
    }

    public function getById(int|string $id): Aspiration
    {
        return $this->repository->findOrFail($id);
    }

    public function respond(int|string $id, array $data): Aspiration
    {
        $aspiration = $this->getById($id);

        if (isset($data['status']) && $data['status'] !== $aspiration->status) {
            $data['responded_at'] = $data['status'] === Aspiration::STATUS_NEW ? null : now();
        }

        return $this->repository->update($aspiration, $data);
    }

    public function delete(int|string $id): bool
    {
        $aspiration = $this->getById($id);
        $this->deletePaths($aspiration->photos ?? []);

        return $this->repository->delete($aspiration);
    }

    public function statusCounts(): array
    {
        return $this->repository->countByStatus();
    }
}
