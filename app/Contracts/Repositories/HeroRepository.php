<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\HeroRepositoryInterface;
use App\Models\Hero;
use Illuminate\Database\Eloquent\Collection;

class HeroRepository implements HeroRepositoryInterface
{
    /**
     * Ambil seluruh banner beranda diurutkan dari urutan tampil.
     */
    public function all(): Collection
    {
        return Hero::query()->ordered()->get();
    }

    /**
     * Ambil banner beranda yang aktif.
     */
    public function active(): Collection
    {
        return Hero::query()->active()->ordered()->get();
    }

    /**
     * Ambil satu banner aktif teratas.
     */
    public function firstActive(): ?Hero
    {
        return Hero::query()->active()->ordered()->first();
    }

    /**
     * Cari banner berdasarkan id, atau gagal.
     */
    public function findOrFail(int|string $id): Hero
    {
        return Hero::query()->findOrFail($id);
    }

    /**
     * Simpan banner baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Hero
    {
        return Hero::query()->create($data);
    }

    /**
     * Perbarui banner dan kembalikan data terbarunya.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Hero $hero, array $data): Hero
    {
        $hero->update($data);

        return $hero->refresh();
    }

    /**
     * Hapus banner.
     */
    public function delete(Hero $hero): bool
    {
        return (bool) $hero->delete();
    }
}
