<?php

namespace Database\Seeders;

use App\Enums\TeacherGroupEnum;
use App\Models\Teacher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Seeder data Bapak & Ibu Guru SMKN 2 Kota Mojokerto
 * berdasarkan data pengampu resmi di e-Learning (http://smkn2mojokerto.my.id/).
 */
class TeacherSeeder extends Seeder
{
    public function run(): void
    {
        if (! Schema::hasTable('teachers')) {
            return;
        }

        $teachers = [
            // Pimpinan
            ['name' => 'Drs. H. Iswahyudi, S.ST., M.Pd.', 'position' => 'Kepala Sekolah', 'group' => TeacherGroupEnum::PIMPINAN->value, 'subject' => 'Manajemen Pendidikan Vokasi', 'photo' => '/images/kepala-sekolah.webp'],

            // Produktif RPL
            ['name' => 'Supriati, S.Kom.', 'position' => 'Guru Produktif RPL', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pemrograman Berorientasi Objek & Basis Data'],
            ['name' => 'Sri Astutik Ningsih, S.T.', 'position' => 'Guru Produktif RPL', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Dasar Desain Grafis & KIK'],
            ['name' => 'Lilik Emi Rahayu, S.Pd., M.Pd.', 'position' => 'Guru Produktif RPL', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pemrograman Web & Mapel Pilihan Web'],
            ['name' => 'Vebriyanti Dwi Anggraini, S.Pd., M.Pd.', 'position' => 'Guru Produktif RPL', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pemrograman Web & KIK'],
            ['name' => 'Leni Kristiana Dewi, S.T.', 'position' => 'Guru Produktif RPL', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pemrograman Web'],
            ['name' => 'Indah Tri Utami, S.Pd.', 'position' => 'Guru Produktif RPL', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pemrograman Mobile & Basis Data'],
            ['name' => 'Danang Teguh Santoso, S.Kom.', 'position' => 'Guru Produktif RPL', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pemrograman Mobile & Mapel Pilihan RPL'],
            ['name' => 'Irsam Muhammad Fathoni, S.Pd., Gr.', 'position' => 'Guru Produktif RPL', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Basis Data & Mapel Pilihan RPL'],

            // Produktif DKV
            ['name' => 'Jatmiko Tri Wijayanto, S.T.', 'position' => 'Guru Produktif DKV', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Tipografi, Fotografi & Proses Produksi Desain'],
            ['name' => 'Susi Suryani Rahayu, S.Sn.', 'position' => 'Guru Produktif DKV', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Komputer Grafis & Desain Brief'],
            ['name' => 'Novaria Fajar Kurniawan, S.Sn.', 'position' => 'Guru Produktif DKV', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Perangkat Lunak Desain & Karya DKV'],
            ['name' => 'Nurfalah Septayoga, S.Kom.', 'position' => 'Guru Produktif DKV & Informatika', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Videografi, Fotografi Lanjut & Informatika'],

            // Produktif Kuliner
            ['name' => 'Mulat Adityawiranti, S.Pd.', 'position' => 'Guru Produktif Kuliner', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Dasar Keahlian Kuliner & Makanan Indonesia'],
            ['name' => 'Arini Prasetyoningtyas, S.Pd., M.Pd.', 'position' => 'Guru Produktif Kuliner', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bakery Pastry & Pengolahan Makanan'],
            ['name' => 'Sutarjo Suparman Nur Cahyono, S.Pd., Gr.', 'position' => 'Guru Produktif Kuliner', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Dasar Keahlian Kuliner & Masakan Oriental'],
            ['name' => 'Endah Trapsilawati Nawangsih, S.Pd.', 'position' => 'Guru Produktif Kuliner', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Tata Hidang & Dasar Keahlian Kuliner'],
            ['name' => 'Anissa Diana Sugiyono, S.Pd.', 'position' => 'Guru Produktif Kuliner', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Tata Hidang, Kue Indonesia & KIK'],
            ['name' => 'Dhiyah Amanati Kartika Sari, S.Pd.', 'position' => 'Guru Produktif Kuliner', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bakery & Pastry'],
            ['name' => 'Ika Noviyati, S.Pd.', 'position' => 'Guru Produktif Kuliner', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Kue Indonesia, Bakery Pastry & KIK'],
            ['name' => 'Lastiani Sundari, S.Pd.', 'position' => 'Guru Produktif Kuliner', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Makanan Kontinental & Penyajian Makanan'],
            ['name' => 'Dra. Lugiati', 'position' => 'Guru Produktif Kuliner', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Produk Cake dan Kue Indonesia (PCKI)'],
            ['name' => 'Sri Andrijanti, S.Pd.', 'position' => 'Guru Produktif Kuliner', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Makanan Indonesia, Masakan Oriental & KIK'],

            // Produktif LPS
            ['name' => 'Hafifah Ratna Damayanti, S.Pd.', 'position' => 'Guru Produktif LPS', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Spreadsheet, Komputer Akuntansi & Bisnis Digital'],
            ['name' => 'Melati Puspita Sari, S.Pd.', 'position' => 'Guru Produktif LPS', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Akuntansi Syariah, Pengelolaan Kas & Etika Profesi'],
            ['name' => 'Arikaweku Ckrisna, S.Pd., M.Pd.', 'position' => 'Guru Produktif LPS', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Dasar Akuntansi, Ekonomi Islam & Akuntansi Syariah'],
            ['name' => "Mar'atus Sholihah Wahyuliati, S.Pd.", 'position' => 'Guru Produktif LPS', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Dasar Perbankan, Ekonomi Islam & Komputer Akuntansi'],
            ['name' => 'Metiy Ardiana, S.Pd., M.Pd.', 'position' => 'Guru Produktif LPS', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Layanan Lembaga Keuangan Syariah & Ekonomi Bisnis'],

            // Produktif APHP
            ['name' => 'Rani Puspitasari, S.T.P.', 'position' => 'Guru Produktif APHP', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Olahan Hewani, Keamanan Pangan & Mamin Herbal'],
            ['name' => 'Desy Andini Diliawati, S.TP.', 'position' => 'Guru Produktif APHP', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Dasar Keahlian APHP & Olahan Hewani'],
            ['name' => 'Liawanti Gestika Ardiyana, S.Pi.', 'position' => 'Guru Produktif APHP', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Olahan Nabati, Rempah & Kimia Hasil Pertanian'],
            ['name' => 'Intan Switzerlistania Martha, S.Pi.', 'position' => 'Guru Produktif APHP', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Olahan Nabati, Penyimpanan & Mamin Herbal'],

            // Mapel Umum (Normatif & Adaptif)
            ['name' => 'Alif Nursyah, S.Pd.', 'position' => 'Guru Matematika', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Matematika'],
            ['name' => 'Fajar Dhilamaya, S.Pd.', 'position' => 'Guru Matematika', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Matematika'],
            ['name' => 'Mega Novinda Sari, S.Pd.', 'position' => 'Guru Matematika', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Matematika'],
            ['name' => 'Elok Zakiyatul M., S.Si.', 'position' => 'Guru Matematika', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Matematika'],
            ['name' => 'Sri Wahyuni, S.Pd.', 'position' => 'Guru Matematika & KIK', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Matematika & Kewirausahaan (KIK)'],
            ['name' => 'Oktavia Catur Handini, S.Pd.', 'position' => 'Guru Bahasa Indonesia', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Indonesia'],
            ['name' => 'Mochammad Asrori, S.Pd.', 'position' => 'Guru Bahasa Indonesia', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Indonesia'],
            ['name' => 'Indah Chodijah, S.Pd.', 'position' => 'Guru Bahasa Indonesia', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Indonesia'],
            ['name' => 'Septa Yuda Pratama, S.Pd.', 'position' => 'Guru Bahasa Indonesia', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Indonesia'],
            ['name' => 'Brillian Wahyu Andrian, S.Pd.', 'position' => 'Guru Bahasa Indonesia & Inggris', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Indonesia & Bahasa Inggris'],
            ['name' => 'Rahmat Efendi, S.Pd.', 'position' => 'Guru Bahasa Inggris', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Inggris'],
            ['name' => 'Rudik Sanjaya Sugiarto, S.S., MBA.', 'position' => 'Guru Bahasa Inggris', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Inggris'],
            ['name' => 'Eka Ardian Suharko, M.Pd.', 'position' => 'Guru Bahasa Inggris', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Inggris'],
            ['name' => 'Erik Efendi, S.Pd.', 'position' => 'Guru Bahasa Inggris', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Inggris'],
            ['name' => 'Puji Indah Kurniawati, S.Pd.', 'position' => 'Guru Bahasa Inggris', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Inggris'],
            ['name' => 'Nur Maulidah Hasanah, S.Pd.', 'position' => 'Guru Pendidikan Pancasila', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pendidikan Pancasila'],
            ['name' => 'Sri Mulyati, S.Pd.', 'position' => 'Guru Pendidikan Pancasila', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pendidikan Pancasila'],
            ['name' => 'Nurul Hidayah, S.E.', 'position' => 'Guru Pendidikan Pancasila', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pendidikan Pancasila'],
            ['name' => 'Cindy Endriana, S.Pd.', 'position' => 'Guru Sejarah Indonesia', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Sejarah Indonesia'],
            ['name' => 'Tyas Wahyu Ningsih, S.Pd.', 'position' => 'Guru Sejarah Indonesia', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Sejarah Indonesia'],
            ['name' => 'Yusi Herawati, S.Pd.', 'position' => 'Guru Proyek IPAS', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Proyek IPAS'],
            ['name' => 'Ainur Rofik, M.Pd.Si.', 'position' => 'Guru Proyek IPAS', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Proyek IPAS'],
            ['name' => 'M. Wira Hendy Himawan, M.Pd.', 'position' => 'Guru Proyek IPAS', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Proyek IPAS'],
            ['name' => 'Indira Kusumaning Fuadah, S.Pd.', 'position' => 'Guru Informatika', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Informatika'],
            ['name' => 'Intan Nur Fitri, S.Pd.', 'position' => 'Guru PABP', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pendidikan Agama & Budi Pekerti (PABP)'],
            ['name' => "Ahmad Rofi'i Noprianto, S.Pd.I.", 'position' => 'Guru PABP', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pendidikan Agama & Budi Pekerti (PABP)'],
            ['name' => 'Avif Sulaiman Nur, S.Ag.', 'position' => 'Guru PABP', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Pendidikan Agama & Budi Pekerti (PABP)'],
            ['name' => 'Harjo Santoso, S.Pd.', 'position' => 'Guru PJOK', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'PJOK'],
            ['name' => 'Basukisna Setya Candra, S.Pd.', 'position' => 'Guru PJOK', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'PJOK'],
            ['name' => 'Gisik Giriantoko, S.Pd.', 'position' => 'Guru PJOK', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'PJOK'],
            ['name' => 'Nur Choiroh Bekti Wiyati, S.Pd.', 'position' => 'Guru Bahasa Jawa', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Jawa'],
            ['name' => 'Yusuf Widhiarso, S.Pd.', 'position' => 'Guru Bahasa Jawa', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Jawa'],
            ['name' => 'Adhela Indra Saphira, S.Pd.', 'position' => 'Guru Bahasa Jawa', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bahasa Jawa'],
            ['name' => 'Hafid Setiawan, S.Pd.', 'position' => 'Guru Seni Budaya', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Seni Budaya'],

            // BK & KIK
            ['name' => 'Ani Latifah, S.Pd.', 'position' => 'Guru Bimbingan Konseling (BK)', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bimbingan Konseling (BK)'],
            ['name' => 'Ariqa Ayni Alfianita S., S.Psi.', 'position' => 'Guru Bimbingan Konseling (BK)', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bimbingan Konseling (BK)'],
            ['name' => 'Sugianto, S.Pd.', 'position' => 'Guru Bimbingan Konseling (BK)', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bimbingan Konseling (BK)'],
            ['name' => 'Bintang Ananta Elyana P., S.Pd.', 'position' => 'Guru Bimbingan Konseling (BK)', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Bimbingan Konseling (BK)'],
            ['name' => 'Yeti Diah Retnowulan, S.Sos.', 'position' => 'Guru KIK', 'group' => TeacherGroupEnum::GURU->value, 'subject' => 'Kreativitas, Inovasi & Kewirausahaan (KIK)'],
        ];

        foreach ($teachers as $index => $teacher) {
            Teacher::query()->updateOrCreate(
                ['slug' => Str::slug($teacher['name'])],
                [
                    'photo' => null,
                    ...$teacher,
                    'is_published' => true,
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}
