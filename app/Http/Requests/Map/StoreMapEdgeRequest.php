<?php

namespace App\Http\Requests\Map;

use Illuminate\Foundation\Http\FormRequest;

class StoreMapEdgeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'from_node_id' => ['required', 'integer', 'exists:map_nodes,id'],
            'to_node_id' => ['required', 'integer', 'exists:map_nodes,id', 'different:from_node_id'],
            'name' => ['nullable', 'string', 'max:255'],
            // Kosong/0 = dihitung otomatis dari koordinat node saat merute
            'distance' => ['nullable', 'numeric', 'min:0'],
            'is_walkable' => ['nullable', 'boolean'],
        ];
    }
}
