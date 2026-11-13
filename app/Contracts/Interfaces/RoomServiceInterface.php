<?php

namespace App\Contracts\Interfaces;

use App\Models\Facility;
use App\Models\Room;
use Illuminate\Database\Eloquent\Collection;

interface RoomServiceInterface
{
    /**
     * Kontrak method getActiveRooms.
     *
     * @return Collection
     */
    public function getActiveRooms(): Collection;

    /**
     * Kontrak method getAllAdminRooms.
     *
     * @return Collection
     */
    public function getAllAdminRooms(): Collection;

    /**
     * Kontrak method searchRooms.
     *
     * @param  string  $query
     * @return Collection
     */
    public function searchRooms(string $query): Collection;

    /**
     * Kontrak method getRoomDetail.
     *
     * @param  int|string  $identifier
     * @return Room
     */
    public function getRoomDetail(int|string $identifier): Room;

    /**
     * Kontrak method createRoom.
     *
     * @param  array  $data
     * @return Room
     */
    public function createRoom(array $data): Room;

    /**
     * Kontrak method updateRoom.
     *
     * @param  int|string  $identifier
     * @param  array  $data
     * @return Room
     */
    public function updateRoom(int|string $identifier, array $data): Room;

    /**
     * Kontrak method deleteRoom.
     *
     * @param  int|string  $identifier
     * @return bool
     */
    public function deleteRoom(int|string $identifier): bool;

    /**
     * Kontrak method getRoomFacilities.
     *
     * @param  int|string  $identifier
     * @return Collection
     */
    public function getRoomFacilities(int|string $identifier): Collection;

    /**
     * Kontrak method addFacility.
     *
     * @param  int|string  $identifier
     * @param  array  $data
     * @return Facility
     */
    public function addFacility(int|string $identifier, array $data): Facility;

    /**
     * Kontrak method updateFacility.
     *
     * @param  int|string  $identifier
     * @param  int|string  $facilityId
     * @param  array  $data
     * @return Facility
     */
    public function updateFacility(int|string $identifier, int|string $facilityId, array $data): Facility;

    /**
     * Kontrak method deleteFacility.
     *
     * @param  int|string  $identifier
     * @param  int|string  $facilityId
     * @return bool
     */
    public function deleteFacility(int|string $identifier, int|string $facilityId): bool;
}
