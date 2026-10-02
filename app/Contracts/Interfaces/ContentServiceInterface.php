<?php

namespace App\Contracts\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Layanan konten publik + CRUD admin (jurusan, prestasi, ekstra, berita, lowongan).
 */
interface ContentServiceInterface
{
    public function getPublished(array $filters = []): Collection;

    public function getPublishedByIdentifier(int|string $identifier): Model;

    public function getAll(): Collection;

    public function getByIdentifier(int|string $identifier): Model;

    public function create(array $data): Model;

    public function update(int|string $identifier, array $data): Model;

    public function delete(int|string $identifier): bool;
}
