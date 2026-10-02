<?php

namespace App\Contracts\Interfaces;

use App\Models\Aspiration;
use Illuminate\Database\Eloquent\Collection;

interface AspirationServiceInterface
{
    public function getFollowedUp(int $limit = 10): Collection;

    public function submit(array $data): Aspiration;

    public function getAll(): Collection;

    public function getById(int|string $id): Aspiration;

    public function respond(int|string $id, array $data): Aspiration;

    public function delete(int|string $id): bool;

    public function statusCounts(): array;
}
