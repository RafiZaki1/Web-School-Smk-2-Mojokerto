<?php

namespace Database\Seeders;

use App\Enums\AdministrationStatusEnum;
use App\Enums\GraduationReleaseModeEnum;
use App\Enums\GraduationStatusEnum;
use App\Enums\SchoolClassEnum;
use App\Helpers\AcademicYearHelper;
use App\Models\Graduate;
use App\Models\GraduationSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Data uji Cek Kelulusan dan Direktori Lulusan.
 *
 * Akun uji utama (cek dengan NISN + nama lengkap):
 * - 0081111111 / Ahmad Rizal Maulana : Lulus, administrasi beres
 * - 0082222222 / Citra Ayu Lestari : Lulus, administrasi belum beres (ada catatan)
 * - 0083333333 / Bayu Firmansyah : Ditunda (ada catatan)
 */
class GraduationSeeder extends Seeder
{
    private const PASSED = GraduationStatusEnum::PASSED;

    private const DEFERRED = GraduationStatusEnum::DEFERRED;

    private const CLEARED = AdministrationStatusEnum::CLEARED;

    private const PENDING = AdministrationStatusEnum::PENDING;

    public function run(): void
    {
        $activeYear = AcademicYearHelper::graduationYear();

        $this->settings($activeYear);
        $this->currentStudents($activeYear);
        $this->archivedGraduates($activeYear);
    }

    /**
     * Mode awal Buka Langsung. release_at tetap diisi (14 hari lagi pukul 10.00 WIB)
     * supaya mode Gunakan Timer bisa langsung dicoba tanpa mengisi tanggal.
     */
    private function settings(int $activeYear): void
    {
        GraduationSetting::query()->updateOrCreate(['id' => 1], [
            'active_year' => $activeYear,
            'release_mode' => GraduationReleaseModeEnum::OPEN->value,
            'release_at' => Carbon::now('Asia/Jakarta')->addDays(14)->setTime(10, 0)->utc(),
            'closed_message' => 'Pengumuman kelulusan belum dibuka. Pantau informasi resmi dari sekolah.',
        ]);
    }

    private function currentStudents(int $year): void
    {
        $rows = [
            // XII RPL 1
            ['0081111111', 'Ahmad Rizal Maulana', '2008-05-10', SchoolClassEnum::RPL_1, self::PASSED, self::CLEARED, null],
            ['0084000101', 'Nabila Putri Maharani', '2008-03-22', SchoolClassEnum::RPL_1, self::PASSED, self::CLEARED, null],
            // XII RPL 2
            ['0084000201', 'Rizky Aditya Pratama', '2008-07-14', SchoolClassEnum::RPL_2, self::PASSED, self::CLEARED, null],
            ['0084000202', 'Salsabila Azzahra', '2008-11-03', SchoolClassEnum::RPL_2, self::PASSED, self::PENDING, 'Laporan PKL belum diserahkan ke Ketua Program Keahlian RPL.'],
            // XII RPL 3
            ['0084000301', 'Muhammad Irfan Hakim', '2008-01-29', SchoolClassEnum::RPL_3, self::PASSED, self::CLEARED, null],
            ['0084000302', 'Dewi Anggraeni', '2008-09-09', SchoolClassEnum::RPL_3, self::PASSED, self::CLEARED, null],
            // XII LPS 1
            ['0084000401', 'Aulia Rahmawati', '2008-02-18', SchoolClassEnum::LPS_1, self::PASSED, self::CLEARED, null],
            ['0084000402', 'Fajar Nur Hidayat', '2008-06-25', SchoolClassEnum::LPS_1, self::PASSED, self::PENDING, 'Iuran komite semester genap belum lunas. Selesaikan di loket keuangan.'],
            // XII LPS 2
            ['0084000501', 'Siti Khoirunnisa', '2008-10-12', SchoolClassEnum::LPS_2, self::PASSED, self::CLEARED, null],
            ['0084000502', 'Bagas Wicaksono', '2008-04-30', SchoolClassEnum::LPS_2, self::PASSED, self::CLEARED, null],
            // XII DKV 1
            ['0082222222', 'Citra Ayu Lestari', '2008-08-17', SchoolClassEnum::DKV_1, self::PASSED, self::PENDING, 'Harap mengembalikan buku perpustakaan dan menyelesaikan bebas laboratorium sebelum mengambil SKL di ruang TU.'],
            ['0084000601', 'Kevin Ardiansyah', '2008-12-20', SchoolClassEnum::DKV_1, self::PASSED, self::CLEARED, null],
            // XII DKV 2
            ['0084000701', 'Alya Safitri', '2008-05-05', SchoolClassEnum::DKV_2, self::PASSED, self::CLEARED, null],
            ['0084000702', 'Dimas Prasetyo', '2008-03-11', SchoolClassEnum::DKV_2, self::PASSED, self::CLEARED, null],
            // XII APHP 1
            ['0084000801', 'Putri Ayu Wulandari', '2008-07-07', SchoolClassEnum::APHP_1, self::PASSED, self::CLEARED, null],
            ['0084000802', 'Yoga Saputra', '2008-01-15', SchoolClassEnum::APHP_1, self::PASSED, self::CLEARED, null],
            // XII APHP 2
            ['0084000901', 'Lutfi Hamdani', '2008-09-28', SchoolClassEnum::APHP_2, self::DEFERRED, self::PENDING, 'Nilai uji kompetensi belum memenuhi. Silakan menemui Wali Kelas dan Ketua Program Keahlian APHP.'],
            ['0084000902', 'Intan Permatasari', '2008-06-02', SchoolClassEnum::APHP_2, self::PASSED, self::CLEARED, null],
            // XII Kuliner 1
            ['0084001001', 'Rahma Dwi Oktaviani', '2008-10-21', SchoolClassEnum::KULINER_1, self::PASSED, self::CLEARED, null],
            ['0084001002', 'Agus Setiawan', '2008-02-08', SchoolClassEnum::KULINER_1, self::PASSED, self::CLEARED, null],
            // XII Kuliner 2
            ['0083333333', 'Bayu Firmansyah', '2008-12-01', SchoolClassEnum::KULINER_2, self::DEFERRED, self::PENDING, 'Silakan menemui Wali Kelas dan Wakil Kepala Sekolah Bidang Kurikulum.'],
            ['0084001101', 'Nur Aini Fitriyah', '2008-04-16', SchoolClassEnum::KULINER_2, self::PASSED, self::CLEARED, null],
            // XII Kuliner 3
            ['0084001201', 'Hendra Kurniawan', '2008-08-08', SchoolClassEnum::KULINER_3, self::PASSED, self::CLEARED, null],
            ['0084001202', 'Melati Sukmawati', '2008-11-27', SchoolClassEnum::KULINER_3, self::PASSED, self::PENDING, 'Seragam praktik pinjaman sekolah belum dikembalikan ke bengkel Kuliner.'],
        ];

        foreach ($rows as [$nisn, $name, $birthDate, $class, $status, $administration, $note]) {
            Graduate::query()->updateOrCreate(['nisn' => $nisn], [
                'full_name' => $name,
                'birth_date' => $birthDate,
                'class_name' => $class->value,
                'major_code' => $class->major()->value,
                'graduation_year' => $year,
                'status' => $status->value,
                'administration_status' => $administration->value,
                'note' => $note,
                'is_archived' => false,
                'archived_at' => null,
            ]);
        }
    }

    /**
     * Lulusan dua angkatan sebelumnya, tampil di Direktori Lulusan tanpa login.
     */
    private function archivedGraduates(int $activeYear): void
    {
        $lastYear = $activeYear - 1;
        $twoYearsAgo = $activeYear - 2;

        $rows = [
            ['0074000001', 'Andika Pratama', '2007-04-12', SchoolClassEnum::RPL_1, $lastYear],
            ['0074000002', 'Farah Nabila', '2007-08-03', SchoolClassEnum::RPL_2, $lastYear],
            ['0074000003', 'Galih Saputra', '2007-01-27', SchoolClassEnum::LPS_1, $lastYear],
            ['0074000004', 'Hana Safira', '2007-11-15', SchoolClassEnum::DKV_2, $lastYear],
            ['0074000005', 'Ilham Maulana', '2007-06-09', SchoolClassEnum::APHP_1, $lastYear],
            ['0074000006', 'Jihan Aulia', '2007-03-30', SchoolClassEnum::KULINER_1, $lastYear],
            ['0074000007', 'Kartika Sari', '2007-09-18', SchoolClassEnum::KULINER_3, $lastYear],
            ['0074000008', 'Lukman Hakim', '2007-12-04', SchoolClassEnum::DKV_1, $lastYear],
            ['0064000001', 'Maya Anggraini', '2006-02-21', SchoolClassEnum::RPL_3, $twoYearsAgo],
            ['0064000002', 'Naufal Rizqi', '2006-07-11', SchoolClassEnum::LPS_2, $twoYearsAgo],
            ['0064000003', 'Oktavia Ramadhani', '2006-10-01', SchoolClassEnum::DKV_1, $twoYearsAgo],
            ['0064000004', 'Prasetyo Wibowo', '2006-05-17', SchoolClassEnum::APHP_2, $twoYearsAgo],
            ['0064000005', 'Qori Amalia', '2006-08-26', SchoolClassEnum::KULINER_2, $twoYearsAgo],
        ];

        foreach ($rows as [$nisn, $name, $birthDate, $class, $year]) {
            Graduate::query()->updateOrCreate(['nisn' => $nisn], [
                'full_name' => $name,
                'birth_date' => $birthDate,
                'class_name' => $class->value,
                'major_code' => $class->major()->value,
                'graduation_year' => $year,
                'status' => self::PASSED->value,
                'administration_status' => self::CLEARED->value,
                'note' => null,
                'is_archived' => true,
                'archived_at' => Carbon::create($year, 7, 1),
            ]);
        }
    }
}
