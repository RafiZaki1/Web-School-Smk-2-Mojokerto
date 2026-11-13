<?php

namespace Database\Seeders;

use App\Enums\GuestMessageStatusEnum;
use App\Enums\GuestVisitStatusEnum;
use App\Models\GuestMessage;
use App\Models\GuestVisit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Contoh pesan pengunjung dan jadwal kunjungan tamu instansi.
 */
class GuestBookSeeder extends Seeder
{
    public function run(): void
    {
        $this->messages();
        $this->visits();
    }

    private function messages(): void
    {
        $rows = [
            ['Rina Marlina', 'rina.marlina@example.com', null, 'Jadwal pengambilan rapor', 'Kapan jadwal pengambilan rapor semester ganjil kelas X?', GuestMessageStatusEnum::NEW, 2],
            ['Hadi Susanto', null, '081330001122', 'Pendaftaran siswa pindahan', 'Apakah sekolah menerima siswa pindahan kelas XI jurusan DKV di semester genap?', GuestMessageStatusEnum::NEW, 5],
            ['Yuliana Putri', 'yuliana.p@example.com', null, 'Legalisir ijazah', 'Berapa lama proses legalisir ijazah dan apakah bisa diwakilkan?', GuestMessageStatusEnum::READ, 20],
            ['CV Mitra Boga', 'hrd@mitraboga.example.com', '0321390011', 'Rekrutmen lulusan Kuliner', 'Kami ingin bekerja sama untuk rekrutmen lulusan Kuliner. Mohon informasi kontak BKK.', GuestMessageStatusEnum::REPLIED, 48],
            ['Fitri Handayani', null, '085755554321', 'Kehilangan kartu pelajar', 'Bagaimana cara mengurus kartu pelajar yang hilang?', GuestMessageStatusEnum::REPLIED, 72],
        ];

        foreach ($rows as [$name, $email, $phone, $subject, $message, $status, $hoursAgo]) {
            $sentAt = Carbon::now()->subHours($hoursAgo);

            $record = GuestMessage::query()->updateOrCreate(['name' => $name, 'subject' => $subject], [
                'email' => $email,
                'phone' => $phone,
                'message' => $message,
                'status' => $status->value,
                'read_at' => $status === GuestMessageStatusEnum::NEW ? null : $sentAt->copy()->addHour(),
                'replied_at' => $status === GuestMessageStatusEnum::REPLIED ? $sentAt->copy()->addHours(3) : null,
            ]);

            $record->forceFill(['created_at' => $sentAt])->saveQuietly();
        }
    }

    private function visits(): void
    {
        $today = Carbon::today();

        $rows = [
            ['Drs. Bambang Sutrisno', 'Dinas Pendidikan Provinsi Jawa Timur', '081234560001', 'Monitoring pelaksanaan PKL kelas XII.', $today->copy()->addDays(2), '09:00', 3, 'Wakil Kepala Sekolah Bidang Humas', GuestVisitStatusEnum::SCHEDULED],
            ['Ratna Dewi', 'PT. Otak Kanan', '081234560002', 'Penandatanganan perjanjian kerja sama PKL jurusan RPL.', $today->copy()->addDays(5), '10:30', 2, 'Ketua Program Keahlian RPL', GuestVisitStatusEnum::SCHEDULED],
            ['Agung Prasetya', 'Bank Muamalat Cab. Mojokerto', '081234560003', 'Sosialisasi rekrutmen lulusan LPS.', $today->copy()->addDays(9), '13:00', 2, 'Koordinator BKK', GuestVisitStatusEnum::SCHEDULED],
            ['Sri Wahyuni', 'SMP Negeri 1 Kota Mojokerto', '081234560004', 'Kunjungan studi siswa kelas IX.', $today->copy()->subDays(6), '08:00', 40, 'Wakil Kepala Sekolah Bidang Kesiswaan', GuestVisitStatusEnum::COMPLETED],
        ];

        foreach ($rows as [$name, $institution, $phone, $purpose, $date, $time, $participants, $host, $status]) {
            GuestVisit::query()->updateOrCreate(['institution' => $institution, 'purpose' => $purpose], [
                'visitor_name' => $name,
                'phone' => $phone,
                'visit_date' => $date->toDateString(),
                'visit_time' => $time,
                'participants' => $participants,
                'person_to_meet' => $host,
                'status' => $status->value,
            ]);
        }
    }
}
