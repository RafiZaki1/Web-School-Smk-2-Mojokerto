<?php

namespace Database\Seeders;

use App\Enums\MajorCodeEnum;
use App\Models\IndustryPartner;
use App\Models\InternshipDocumentation;
use Illuminate\Database\Seeder;

/**
 * Mitra DU/DI (dari MitraList) dan contoh dokumentasi PKL.
 */
class PartnershipSeeder extends Seeder
{
    public function run(): void
    {
        $this->partners();
        $this->documentations();
    }

    /**
     * Kategori "UMUM" di MitraList dibuang; mitra yang hanya UMUM tersimpan
     * dengan major_codes kosong (mitra umum).
     */
    private function partners(): void
    {
        foreach (MitraList::semua() as $index => $mitra) {
            $codes = array_values(array_intersect($mitra['kategori'], MajorCodeEnum::values()));

            IndustryPartner::query()->updateOrCreate(['name' => $mitra['name']], [
                'logo' => $mitra['logo'],
                'major_codes' => $codes,
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }
    }

    /**
     * Gambar memakai foto fasilitas yang sudah ada di Next.js sebagai pengganti
     * sementara; TU mengganti dengan foto PKL asli lewat dashboard.
     */
    private function documentations(): void
    {
        $rows = [
            ['Pembuatan modul aplikasi kasir', 'Siswa XII RPL menyusun modul kasir berbasis web bersama tim pengembang mitra.', '/images/fasilitas/rpl-1.jpg', MajorCodeEnum::RPL, 'PT. Otak Kanan', '2026-02-16'],
            ['Pelayanan nasabah di kantor cabang', 'Siswa LPS mendampingi petugas customer service dan teller.', '/images/fasilitas/lps-2.jpg', MajorCodeEnum::LPS, 'Bank Muamalat Cab. Mojokerto', '2026-02-23'],
            ['Produksi materi promosi digital', 'Siswa DKV membuat aset visual media sosial untuk klien studio.', '/images/fasilitas/dkv-1.jpg', MajorCodeEnum::DKV, 'OurStudio', '2026-03-02'],
            ['Produksi donat dan kontrol mutu', 'Siswa APHP mengikuti proses produksi harian dan pencatatan kontrol mutu.', '/images/fasilitas/aphp-1.jpg', MajorCodeEnum::APHP, 'Hachi Donuts', '2026-03-09'],
            ['Pengemasan produk olahan', 'Siswa APHP belajar standar pengemasan dan pelabelan produk.', '/images/fasilitas/aphp-2.jpg', MajorCodeEnum::APHP, 'PT. Sido Jodo', '2026-03-16'],
            ['Persiapan banquet hotel', 'Siswa Kuliner membantu persiapan hidangan acara di dapur hotel.', '/images/fasilitas/tb-1.jpg', MajorCodeEnum::KULINER, 'Aston Hotel Mojokerto', '2026-03-23'],
        ];

        foreach ($rows as $index => [$title, $description, $image, $major, $partnerName, $date]) {
            InternshipDocumentation::query()->updateOrCreate(['title' => $title], [
                'description' => $description,
                'image' => $image,
                'major_code' => $major->value,
                'industry_partner_id' => IndustryPartner::query()->where('name', $partnerName)->value('id'),
                'activity_date' => $date,
                'is_published' => true,
                'sort_order' => $index + 1,
            ]);
        }
    }
}
