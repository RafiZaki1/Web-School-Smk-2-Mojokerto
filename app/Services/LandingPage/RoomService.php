<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\FileUploadServiceInterface;
use App\Contracts\Interfaces\RoomRepositoryInterface;
use App\Contracts\Interfaces\RoomServiceInterface;
use App\Enums\UploadDirectoryEnum;
use App\Models\Facility;
use App\Models\Room;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoomService implements RoomServiceInterface
{
    /**
     * Inisialisasi RoomService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected RoomRepositoryInterface $roomRepository,
        protected FileUploadServiceInterface $fileUploadService,
    ) {}

    /**
     * Ambil ruangan yang aktif beserta relasinya.
     */
    public function getActiveRooms(): Collection
    {
        return $this->roomRepository->active();
    }

    /**
     * Ambil seluruh ruangan untuk admin.
     */
    public function getAllAdminRooms(): Collection
    {
        return $this->roomRepository->getAllAdmin();
    }

    /**
     * Cari ruangan aktif berdasarkan kata kunci.
     */
    public function searchRooms(string $query): Collection
    {
        return $this->roomRepository->search($query);
    }

    /**
     * Ambil detail ruangan berdasarkan id atau slug, atau gagal.
     */
    public function getRoomDetail(int|string $identifier): Room
    {
        return $this->roomRepository->findByIdentifierOrFail($identifier);
    }

    /**
     * Simpan ruangan baru beserta foto dan slug unik bila slug tidak dikirim.
     *
     * @param  array<string, mixed>  $data
     */
    public function createRoom(array $data): Room
    {
        if (empty($data['slug']) && ! empty($data['name'])) {
            $data['slug'] = $this->uniqueSlug($data['name']);
        }

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $this->fileUploadService->upload($data['image'], UploadDirectoryEnum::ROOMS->value);
        }

        return $this->roomRepository->create($data);
    }

    /**
     * Perbarui ruangan dan ganti fotonya bila ada unggahan baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateRoom(int|string $identifier, array $data): Room
    {
        $room = $this->getRoomDetail($identifier);

        if (empty($data['slug']) && ! empty($data['name']) && $data['name'] !== $room->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $room->id);
        }

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $this->fileUploadService->replace(
                $data['image'],
                $room->image,
                UploadDirectoryEnum::ROOMS->value
            );
        }

        return $this->roomRepository->update($room, $data);
    }

    /**
     * Hapus ruangan. Foto baru dihapus setelah transaksi di controller di-commit.
     */
    public function deleteRoom(int|string $identifier): bool
    {
        $room = $this->getRoomDetail($identifier);
        $image = $room->image;

        $deleted = $this->roomRepository->delete($room);

        if ($image) {
            DB::afterCommit(fn () => $this->fileUploadService->delete($image));
        }

        return $deleted;
    }

    /**
     * Ambil fasilitas milik ruangan.
     */
    public function getRoomFacilities(int|string $identifier): Collection
    {
        return $this->roomRepository->facilities(
            $this->getRoomDetail($identifier)
        );
    }

    /**
     * Tambahkan fasilitas ke ruangan.
     *
     * @param  array<string, mixed>  $data
     */
    public function addFacility(int|string $identifier, array $data): Facility
    {
        $room = $this->getRoomDetail($identifier);

        return $this->roomRepository->createFacility($room, $data);
    }

    /**
     * Perbarui fasilitas milik ruangan tertentu.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateFacility(int|string $identifier, int|string $facilityId, array $data): Facility
    {
        $room = $this->getRoomDetail($identifier);
        $facility = $this->roomRepository->findFacilityOrFail($room, $facilityId);

        return $this->roomRepository->updateFacility($facility, $data);
    }

    /**
     * Hapus fasilitas milik ruangan tertentu.
     */
    public function deleteFacility(int|string $identifier, int|string $facilityId): bool
    {
        $room = $this->getRoomDetail($identifier);
        $facility = $this->roomRepository->findFacilityOrFail($room, $facilityId);

        return $this->roomRepository->deleteFacility($facility);
    }

    /**
     * Buat slug unik dari nama ruangan dengan akhiran angka bila sudah dipakai.
     */
    private function uniqueSlug(string $name, int|string|null $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $counter = 1;

        while ($this->roomRepository->slugExists($slug, $ignoreId)) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
