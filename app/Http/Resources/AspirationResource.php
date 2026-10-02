<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Data aspirasi lengkap untuk panel admin. */
class AspirationResource extends JsonResource
{
    use FormatsImageUrl;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category,
            'title' => $this->title,
            'detail' => $this->detail,
            'photos' => $this->formatImageUrls($this->photos),
            'is_anonymous' => (bool) $this->is_anonymous,
            'sender_name' => $this->is_anonymous ? null : $this->sender_name,
            'status' => $this->status,
            'admin_note' => $this->admin_note,
            'public_response' => $this->public_response,
            'responded_at' => $this->responded_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'created_label' => $this->created_at?->locale('id')->translatedFormat('j M Y'),
            'created_time_label' => $this->created_at?->locale('id')->translatedFormat('j M Y, H:i'),
        ];
    }
}
