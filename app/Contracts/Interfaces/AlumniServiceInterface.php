<?php

namespace App\Contracts\Interfaces;

use App\Models\Alumni;
use Illuminate\Database\Eloquent\Collection;

interface AlumniServiceInterface
{
    public function getList(bool $featuredOnly = false): Collection;

    public function getById(int|string $id): Alumni;

    public function create(array $data): Alumni;

    public function update(int|string $id, array $data): Alumni;

    public function delete(int|string $id): bool;
}
