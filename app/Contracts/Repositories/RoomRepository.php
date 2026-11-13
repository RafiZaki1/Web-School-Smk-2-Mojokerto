<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\RoomRepositoryInterface;
use App\Models\Facility;
use App\Models\Room;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class RoomRepository implements RoomRepositoryInterface
{
    /**
     * Ambil ruangan yang aktif beserta kategori, fasilitas, dan titik peta.
     */
    public function active(): Collection
    {
        return Room::query()
            ->active()
            ->ordered()
            ->with(['category', 'facilities', 'mapNode'])
            ->get();
    }

    /**
     * Ambil seluruh ruangan untuk admin beserta relasinya.
     */
    public function getAllAdmin(): Collection
    {
        return Room::query()
            ->ordered()
            ->with(['category', 'facilities', 'mapNode'])
            ->get();
    }

    /**
     * Cari ruangan aktif berdasarkan nama, slug, gedung, atau kategori.
     */
    public function search(string $query): Collection
    {
        $term = trim($query);
        $like = "%{$term}%";

        return Room::query()
            ->select('rooms.*')
            ->leftJoin('room_categories', 'room_categories.id', '=', 'rooms.category_id')
            ->where('rooms.is_active', true)
            ->with(['category', 'facilities', 'mapNode'])
            ->where(function (Builder $q) use ($like) {
                $q->where('rooms.name', 'like', $like)
                    ->orWhere('rooms.slug', 'like', $like)
                    ->orWhere('rooms.building_name', 'like', $like)
                    ->orWhere('room_categories.name', 'like', $like)
                    ->orWhere('room_categories.slug', 'like', $like);
            })
            ->orderBy('rooms.id')
            ->get();
    }

    /**
     * Cari ruangan berdasarkan id atau slug beserta relasinya, atau gagal.
     */
    public function findByIdentifierOrFail(int|string $identifier): Room
    {
        $query = Room::query()->with(['category', 'facilities', 'mapNode']);

        if (is_numeric($identifier)) {
            return $query->whereKey($identifier)->firstOrFail();
        }

        return $query->where('slug', $identifier)->firstOrFail();
    }

    /**
     * Periksa apakah slug sudah dipakai ruangan lain.
     */
    public function slugExists(string $slug, int|string|null $ignoreId = null): bool
    {
        return Room::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn (Builder $query) => $query->whereKeyNot($ignoreId))
            ->exists();
    }

    /**
     * Simpan ruangan baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Room
    {
        return Room::create($data);
    }

    /**
     * Perbarui ruangan dan muat ulang relasinya.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Room $room, array $data): Room
    {
        $room->update($data);

        return $room->fresh(['category', 'facilities', 'mapNode']);
    }

    /**
     * Hapus ruangan.
     */
    public function delete(Room $room): bool
    {
        return (bool) $room->delete();
    }

    /**
     * Ambil fasilitas milik ruangan, diurutkan dari yang pertama dibuat.
     */
    public function facilities(Room $room): Collection
    {
        return $room->facilities()->orderBy('id')->get();
    }

    /**
     * Cari fasilitas milik ruangan tertentu, atau gagal.
     */
    public function findFacilityOrFail(Room $room, int|string $facilityId): Facility
    {
        return $room->facilities()->whereKey($facilityId)->firstOrFail();
    }

    /**
     * Tambahkan fasilitas baru ke ruangan.
     *
     * @param  array<string, mixed>  $data
     */
    public function createFacility(Room $room, array $data): Facility
    {
        return $room->facilities()->create($data);
    }

    /**
     * Perbarui fasilitas dan kembalikan data terbarunya.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateFacility(Facility $facility, array $data): Facility
    {
        $facility->update($data);

        return $facility->fresh();
    }

    /**
     * Hapus fasilitas.
     */
    public function deleteFacility(Facility $facility): bool
    {
        return (bool) $facility->delete();
    }
}
