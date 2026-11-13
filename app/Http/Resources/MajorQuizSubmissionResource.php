<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Log kuis jurusan lengkap untuk panel admin. */
class MajorQuizSubmissionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'email' => $this->email,
            'answers' => $this->answers,
            'scores' => $this->scores,
            'total_answered' => $this->total_answered,
            'analysis' => $this->analysis,
            'match_method' => $this->match_method,
            'recommended_major' => $this->recommended_major,
            'alternative_major' => $this->alternative_major,
            'final_major' => $this->final_major,
            'result_major' => $this->resultMajor(),
            'public_note' => $this->public_note,
            'admin_note' => $this->admin_note,
            'status' => $this->status,
            'reviewed_at' => $this->reviewed_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'created_label' => $this->created_at?->locale('id')->translatedFormat('j M Y'),
            'created_time_label' => $this->created_at?->locale('id')->translatedFormat('j M Y, H:i'),
        ];
    }
}
