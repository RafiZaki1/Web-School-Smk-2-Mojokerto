<?php

namespace App\Contracts\Interfaces;

use App\Models\Facility;
use App\Models\Room;
use Illuminate\Database\Eloquent\Collection;

interface RoomRepositoryInterface
{
    /**
     * Kontrak method active.
     *
     * @return Collection
     */
    public function active(): Collection;

    /**
     * Kontrak method getAllAdmin.
     *
     * @return Collection
     */
    public function getAllAdmin(): Collection;

    /**
     * Kontrak method search.
     *
     * @param  string  $query
     * @return Collection
     */
    public function search(string $query): Collection;

    /**
     * Kontrak method findByIdentifierOrFail.
     *
     * @param  int|string  $identifier
     * @return Room
     */
    public function findByIdentifierOrFail(int|string $identifier): Room;

    /**
     * Kontrak method slugExists.
     *
     * @param  string  $slug
     * @param  int|string|null  $ignoreId
     * @return bool
     */
    public function slugExists(string $slug, int|string|null $ignoreId = null): bool;

    /**
     * Kontrak method create.
     *
     * @param  array  $data
     * @return Room
     */
    public function create(array $data): Room;

    /**
     * Kontrak method update.
     *
     * @param  Room  $room
     * @param  array  $data
     * @return Room
     */
    public function update(Room $room, array $data): Room;

    /**
     * Kontrak method delete.
     *
     * @param  Room  $room
     * @return bool
     */
    public function delete(Room $room): bool;

    /**
     * Kontrak method facilities.
     *
     * @param  Room  $room
     * @return Collection
     */
    public function facilities(Room $room): Collection;

    /**
     * Kontrak method findFacilityOrFail.
     *
     * @param  Room  $room
     * @param  int|string  $facilityId
     * @return Facility
     */
    public function findFacilityOrFail(Room $room, int|string $facilityId): Facility;

    /**
     * Kontrak method createFacility.
     *
     * @param  Room  $room
     * @param  array  $data
     * @return Facility
     */
    public function createFacility(Room $room, array $data): Facility;

    /**
     * Kontrak method updateFacility.
     *
     * @param  Facility  $facility
     * @param  array  $data
     * @return Facility
     */
    public function updateFacility(Facility $facility, array $data): Facility;

    /**
     * Kontrak method deleteFacility.
     *
     * @param  Facility  $facility
     * @return bool
     */
    public function deleteFacility(Facility $facility): bool;
}
