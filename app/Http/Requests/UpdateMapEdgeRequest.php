<?php

namespace App\Http\Requests;

class UpdateMapEdgeRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi pembaruan sisi (edge) peta.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'from_node_id' => ['sometimes', 'required', 'integer', 'exists:map_nodes,id'],
            'to_node_id' => ['sometimes', 'required', 'integer', 'exists:map_nodes,id', 'different:from_node_id'],
            'name' => ['nullable', 'string', 'max:255'],
            'distance' => ['nullable', 'numeric', 'min:0'],
            'is_walkable' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Ambil pesan galat kustom untuk setiap aturan validasi.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'from_node_id.required' => 'Titik asal wajib dipilih.',
            'from_node_id.integer' => 'Titik asal harus berupa angka.',
            'from_node_id.exists' => 'Titik asal tidak ditemukan.',
            'to_node_id.required' => 'Titik tujuan wajib dipilih.',
            'to_node_id.integer' => 'Titik tujuan harus berupa angka.',
            'to_node_id.exists' => 'Titik tujuan tidak ditemukan.',
            'to_node_id.different' => 'Titik tujuan harus berbeda dengan titik asal.',
            'name.string' => 'Nama jalur harus berupa teks.',
            'name.max' => 'Nama jalur maksimal :max karakter.',
            'distance.numeric' => 'Jarak harus berupa angka.',
            'distance.min' => 'Jarak minimal :min.',
            'is_walkable.boolean' => 'Status dapat dilalui harus berupa benar atau salah.',
        ];
    }
}
