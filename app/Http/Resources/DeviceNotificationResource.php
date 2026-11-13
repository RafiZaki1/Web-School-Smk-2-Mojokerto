<?php

namespace App\Http\Resources;

use App\Models\DeviceNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Satu pesan di ikon lonceng perangkat.
 *
 * @mixin DeviceNotification
 */
class DeviceNotificationResource extends JsonResource
{
    /**
     * Ubah data menjadi array respons API.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'url' => $this->url,
            'is_read' => $this->read_at !== null,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
