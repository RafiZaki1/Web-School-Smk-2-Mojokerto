<?php

namespace App\Http\Requests;

use App\Enums\GuestVisitStatusEnum;
use Illuminate\Validation\Rule;

/**
 * Jadwal kunjungan tamu instansi. Dari form publik hanya data kunjungan yang diterima;
 * status dan catatan diisi TU di dashboard.
 */
class GuestVisitRequest extends ContentRequest
{
    /** @var array<int, string> */
    protected array $booleans = [];

    /**
     * Ambil aturan validasi jadwal kunjungan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $publicForm = ! $this->is('api/v1/admin/*');

        return [
            'visitor_name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'institution' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'phone' => [$publicForm ? 'required' : 'nullable', 'string', 'regex:/^[0-9+\-\s]{8,20}$/'],
            'purpose' => [$this->requiredOnCreate(), 'string', 'max:2000'],
            'visit_date' => [$this->requiredOnCreate(), 'date_format:Y-m-d', ...($publicForm ? ['after_or_equal:today'] : [])],
            'visit_time' => ['nullable', 'date_format:H:i'],
            'participants' => ['nullable', 'integer', 'min:1', 'max:500'],
            'person_to_meet' => ['nullable', 'string', 'max:255'],
            'status' => [$publicForm ? 'prohibited' : 'sometimes', Rule::enum(GuestVisitStatusEnum::class)],
            'note' => [$publicForm ? 'prohibited' : 'nullable', 'string', 'max:2000'],
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
            'visitor_name.required' => 'Nama tamu wajib diisi.',
            'visitor_name.max' => 'Nama tamu maksimal :max karakter.',
            'institution.required' => 'Nama instansi wajib diisi.',
            'institution.max' => 'Nama instansi maksimal :max karakter.',
            'phone.required' => 'Nomor HP wajib diisi.',
            'phone.regex' => 'Nomor HP hanya boleh berisi angka, 8 sampai 20 digit.',
            'purpose.required' => 'Keperluan kunjungan wajib diisi.',
            'purpose.max' => 'Keperluan maksimal :max karakter.',
            'visit_date.required' => 'Tanggal kunjungan wajib diisi.',
            'visit_date.date_format' => 'Tanggal kunjungan harus berformat tahun-bulan-tanggal.',
            'visit_date.after_or_equal' => 'Tanggal kunjungan paling cepat hari ini.',
            'visit_time.date_format' => 'Jam kunjungan harus berformat jam:menit, mis. 09:30.',
            'participants.integer' => 'Jumlah peserta harus berupa angka.',
            'participants.min' => 'Jumlah peserta minimal :min orang.',
            'participants.max' => 'Jumlah peserta maksimal :max orang.',
            'person_to_meet.max' => 'Nama yang ditemui maksimal :max karakter.',
            'status.enum' => 'Status kunjungan tidak valid.',
            'status.prohibited' => 'Status kunjungan diatur oleh TU.',
            'note.max' => 'Catatan maksimal :max karakter.',
            'note.prohibited' => 'Catatan diisi oleh TU.',
        ];
    }
}
