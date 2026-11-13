<?php

namespace App\Http\Resources;

use App\Enums\GuestMessageStatusEnum;
use App\Models\GuestMessage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin GuestMessage
 */
class GuestMessageResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'subject' => $this->subject,
            'message' => $this->message,
            'status' => $this->status,
            'status_label' => GuestMessageStatusEnum::tryFrom((string) $this->status)?->label() ?? $this->status,
            'admin_note' => $this->admin_note,
            'read_at' => $this->read_at?->toISOString(),
            'replied_at' => $this->replied_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
