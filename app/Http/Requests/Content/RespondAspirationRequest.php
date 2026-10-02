<?php

namespace App\Http\Requests\Content;

use App\Models\Aspiration;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Admin memperbarui status & catatan tindak lanjut aspirasi. */
class RespondAspirationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(Aspiration::STATUSES)],
            'admin_note' => ['nullable', 'string', 'max:5000'],
            'public_response' => ['nullable', 'string', 'max:255'],
        ];
    }
}
