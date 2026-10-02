<?php

namespace App\Http\Resources\Concerns;

use Illuminate\Support\Facades\Storage;

/**
 * Shared helper for Resources that need to turn a stored file path
 * into a full public URL. Previously this exact method was copy-pasted
 * into GalleryResource, HeroResource, RoomResource, RoomDetailResource,
 * and SchoolProfileResource — now they all just `use` this trait.
 */
trait FormatsImageUrl
{
    /**
     * Format full image URL from a stored path.
     */
    protected function formatImageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        // Aset bawaan FE (mis. "/images/jurusan/rpl.jpg") dilayani langsung oleh Next.js
        if (str_starts_with($path, '/')) {
            return $path;
        }

        return url(Storage::url($path));
    }

    /**
     * Format a list of stored paths (gallery) into public URLs.
     */
    protected function formatImageUrls(?array $paths): array
    {
        return array_values(array_filter(array_map(fn ($path) => $this->formatImageUrl($path), $paths ?? [])));
    }
}
