<?php

namespace Database\Seeders;

use App\Enums\AlumniServiceStatusEnum;
use App\Enums\AlumniServiceTypeEnum;
use App\Enums\SchoolClassEnum;
use App\Helpers\AcademicYearHelper;
use App\Models\AlumniServiceRequest;
use App\Models\DeviceNotification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * 12 pengajuan berstatus Menunggu, satu per kelas.
 *
 * Tiap pengajuan memakai device_token tetap: 00000000-0000-4000-8000-0000000000NN
 * (NN = 01..12). Untuk melihat lonceng sebagai perangkat pengaju pertama, isi
 * localStorage key "tu_device_token" dengan 00000000-0000-4000-8000-000000000001.
 */
class AlumniServiceRequestSeeder extends Seeder
{
    public function run(): void
    {
        $activeYear = AcademicYearHelper::graduationYear();

        $rows = [
            [SchoolClassEnum::RPL_1, '0074000001', 'Andika Pratama', 1, AlumniServiceTypeEnum::LEGALIZATION, 'Legalisir ijazah 5 lembar untuk melamar kerja di Surabaya.'],
            [SchoolClassEnum::RPL_2, '0074000002', 'Farah Nabila', 1, AlumniServiceTypeEnum::DIPLOMA_PICKUP, 'Mengambil ijazah asli untuk daftar ulang kuliah.'],
            [SchoolClassEnum::RPL_3, '0064000001', 'Maya Anggraini', 2, AlumniServiceTypeEnum::LEGALIZATION, 'Legalisir ijazah dan SKHUN masing-masing 3 lembar untuk seleksi CPNS.'],
            [SchoolClassEnum::LPS_1, '0074000003', 'Galih Saputra', 1, AlumniServiceTypeEnum::FINGERPRINT, 'Cap tiga jari pada ijazah yang belum dibubuhkan.'],
            [SchoolClassEnum::LPS_2, '0064000002', 'Naufal Rizqi', 2, AlumniServiceTypeEnum::LEGALIZATION, 'Legalisir ijazah 4 lembar untuk melamar di bank.'],
            [SchoolClassEnum::DKV_1, '0074000008', 'Lukman Hakim', 1, AlumniServiceTypeEnum::DIPLOMA_PICKUP, 'Mengambil ijazah asli untuk syarat kerja.'],
            [SchoolClassEnum::DKV_2, '0074000004', 'Hana Safira', 1, AlumniServiceTypeEnum::FINGERPRINT, 'Cap tiga jari sebelum pengambilan ijazah.'],
            [SchoolClassEnum::APHP_1, '0074000005', 'Ilham Maulana', 1, AlumniServiceTypeEnum::DIPLOMA_PICKUP, 'Mengambil ijazah asli, sebelumnya belum sempat diambil.'],
            [SchoolClassEnum::APHP_2, '0064000004', 'Prasetyo Wibowo', 2, AlumniServiceTypeEnum::LEGALIZATION, 'Legalisir ijazah 2 lembar untuk pendaftaran beasiswa.'],
            [SchoolClassEnum::KULINER_1, '0074000006', 'Jihan Aulia', 1, AlumniServiceTypeEnum::LEGALIZATION, 'Legalisir ijazah 3 lembar untuk melamar di hotel.'],
            [SchoolClassEnum::KULINER_2, '0064000005', 'Qori Amalia', 2, AlumniServiceTypeEnum::FINGERPRINT, 'Cap tiga jari untuk berkas ijazah.'],
            [SchoolClassEnum::KULINER_3, '0074000007', 'Kartika Sari', 1, AlumniServiceTypeEnum::DIPLOMA_PICKUP, 'Mengambil ijazah asli untuk keperluan kerja di luar negeri.'],
        ];

        foreach ($rows as $index => [$class, $nisn, $name, $yearsAgo, $type, $purpose]) {
            $number = $index + 1;
            $submittedAt = Carbon::now()->subHours(36 - ($number * 2));

            $request = AlumniServiceRequest::query()->updateOrCreate(
                ['ticket_code' => sprintf('TU-SEED%02d', $number)],
                [
                    'device_token' => sprintf('00000000-0000-4000-8000-%012d', $number),
                    'nisn' => $nisn,
                    'full_name' => $name,
                    'graduation_year' => $activeYear - $yearsAgo,
                    'class_name' => $class->value,
                    'major_code' => $class->major()->value,
                    'service_type' => $type->value,
                    'purpose' => $purpose,
                    'phone' => sprintf('0812300000%02d', $number),
                    'status' => AlumniServiceStatusEnum::PENDING->value,
                    'admin_note' => null,
                    'processed_at' => null,
                    'approved_at' => null,
                    'completed_at' => null,
                ]
            );

            $request->forceFill(['created_at' => $submittedAt, 'updated_at' => $submittedAt])->saveQuietly();

            DeviceNotification::query()->updateOrCreate(
                ['alumni_service_request_id' => $request->id, 'title' => 'Pengajuan diterima'],
                [
                    'device_token' => $request->device_token,
                    'body' => "Pengajuan {$type->label()} dengan kode {$request->ticket_code} sudah masuk antrean TU. Status: Menunggu.",
                    'read_at' => null,
                ]
            );
        }
    }
}
