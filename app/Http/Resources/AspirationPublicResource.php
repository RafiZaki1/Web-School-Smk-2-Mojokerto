<?php

namespace App\Http\Resources;

use App\Helpers\DateLabel;
use App\Models\Aspiration;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Aspirasi yang sudah ditindaklanjuti untuk halaman publik (tanpa identitas & catatan internal). */
class AspirationPublicResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category,
            'title' => $this->title,
            'status' => $this->status,
            'public_response' => $this->public_response ?: $this->defaultResponse(),
        ];
    }

    protected function defaultResponse(): string
    {
        return $this->status === Aspiration::STATUS_RESOLVED
            ? 'Ditindaklanjuti — selesai '.DateLabel::long($this->responded_at ?? $this->updated_at)
            : 'Sedang ditinjau oleh pihak sekolah';
    }
}
