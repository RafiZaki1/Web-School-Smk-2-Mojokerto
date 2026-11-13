<?php

namespace Database\Seeders;

use App\Enums\MajorCodeEnum;
use App\Enums\WeekdayEnum;
use App\Models\PracticeUniform;
use App\Models\SchoolRule;
use App\Models\UniformSchedule;
use Illuminate\Database\Seeder;

/**
 * Tata tertib siswa dan panduan seragam. Foto seragam dikosongkan, diunggah TU
 * lewat dashboard. Selama kosong, seragam praktik memakai foto halaman jurusan (frontend).
 */
class StudentGuideSeeder extends Seeder
{
    public function run(): void
    {
        $this->rules();
        $this->dailyUniforms();
        $this->practiceUniforms();
    }

    private function rules(): void
    {
        $sections = [
            'Kehadiran' => [
                'Siswa hadir di sekolah paling lambat pukul 06.45 WIB.',
                'Siswa yang terlambat melapor ke guru piket dan mencatat keterlambatan.',
                'Izin tidak masuk disampaikan orang tua atau wali kepada wali kelas pada hari yang sama.',
                'Siswa tidak boleh meninggalkan sekolah pada jam pelajaran tanpa surat izin dari guru piket.',
            ],
            'Pakaian dan Penampilan' => [
                'Siswa memakai seragam sesuai jadwal harian dan atribut lengkap.',
                'Rambut siswa putra rapi, pendek, dan tidak diwarnai.',
                'Siswa memakai sepatu hitam dan kaus kaki putih, kecuali saat praktik di bengkel.',
                'Perhiasan berlebihan, tato, dan tindik selain telinga bagi siswa putri tidak diperbolehkan.',
            ],
            'Sikap dan Perilaku' => [
                'Siswa bersikap sopan kepada guru, tenaga kependidikan, tamu, dan sesama siswa.',
                'Siswa menjaga kebersihan kelas, bengkel, dan lingkungan sekolah.',
                'Siswa mengikuti upacara bendera dan kegiatan keagamaan yang dijadwalkan sekolah.',
                'Siswa memakai alat pelindung diri saat praktik sesuai ketentuan bengkel.',
            ],
            'Larangan' => [
                'Membawa, menggunakan, atau mengedarkan rokok, rokok elektrik, minuman keras, dan narkoba.',
                'Membawa senjata tajam atau barang berbahaya lain.',
                'Melakukan perundungan, perkelahian, atau tindakan kekerasan dalam bentuk apa pun.',
                'Menggunakan telepon genggam saat jam pelajaran tanpa izin guru.',
            ],
            'Sanksi' => [
                'Pelanggaran dicatat dalam buku poin pelanggaran siswa.',
                'Akumulasi poin ditindaklanjuti dengan pemanggilan orang tua atau wali.',
                'Pelanggaran berat diputuskan melalui rapat dewan guru.',
            ],
        ];

        $order = 0;
        foreach ($sections as $section => $points) {
            foreach ($points as $content) {
                SchoolRule::query()->updateOrCreate(
                    ['section' => $section, 'content' => $content],
                    ['is_active' => true, 'sort_order' => ++$order]
                );
            }
        }
    }

    private function dailyUniforms(): void
    {
        $rows = [
            WeekdayEnum::MONDAY->value => ['Putih Abu-Abu', 'Kemeja putih, celana atau rok abu-abu, dasi, topi, dan ikat pinggang hitam untuk upacara bendera.'],
            WeekdayEnum::TUESDAY->value => ['Putih Abu-Abu', 'Kemeja putih, celana atau rok abu-abu, dan ikat pinggang hitam.'],
            WeekdayEnum::WEDNESDAY->value => ['Seragam Jurusan', 'Seragam praktik sesuai jurusan masing-masing. Lihat panduan seragam praktik.'],
            WeekdayEnum::THURSDAY->value => ['Batik Sekolah', 'Kemeja batik sekolah, celana atau rok hitam.'],
            WeekdayEnum::FRIDAY->value => ['Pramuka', 'Seragam pramuka penggalang lengkap dengan kacu dan atribut gugus depan.'],
        ];

        foreach ($rows as $day => [$name, $description]) {
            UniformSchedule::query()->updateOrCreate(['day' => $day], [
                'name' => $name,
                'description' => $description,
            ]);
        }
    }

    private function practiceUniforms(): void
    {
        $rows = [
            MajorCodeEnum::RPL->value => ['Kemeja Praktik RPL', 'Kemeja hitam lengan pendek dengan aksen abu-abu dan logo jurusan, dipadukan celana atau rok abu-abu. Dipakai saat praktik di laboratorium komputer.'],
            MajorCodeEnum::LPS->value => ['Blazer Perbankan', 'Blazer abu-abu muda berlogo jurusan, kemeja putih, dan celana atau rok kain hitam. Dipakai saat praktik layanan di bank mini.'],
            MajorCodeEnum::DKV->value => ['Kemeja Praktik DKV', 'Kemeja biru lengan pendek dengan bordir logo DKV dan celana atau rok hitam. Dipakai saat praktik di studio dan lab desain.'],
            MajorCodeEnum::APHP->value => ['Baju Praktik APHP', 'Baju praktik biru muda lengan pendek berlogo jurusan, topi biru dengan penutup rambut, dan celana atau rok hitam. Dipakai saat praktik pengolahan pangan.'],
            MajorCodeEnum::KULINER->value => ['Chef Jacket', 'Chef jacket putih berlis hitam, topi koki, scarf leher bergaris hitam putih, apron putih, dan celana hitam. Dipakai di dapur praktik.'],
        ];

        foreach ($rows as $major => [$name, $description]) {
            PracticeUniform::query()->updateOrCreate(['major_code' => $major], [
                'name' => $name,
                'description' => $description,
            ]);
        }
    }
}
