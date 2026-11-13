<?php

namespace Database\Seeders;

/**
 * Daftar mitra industri SMKN 2 Mojokerto. Disalin dari frontend-next/lib/data/mitraData.js
 * (keduanya harus diubah bersama).
 */
class MitraList
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public static function semua(): array
    {
        return [
            ['name' => 'Ruil Power Software House', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'PT. Adira Dinamika Multifinance, Tbk', 'kategori' => ['RPL'], 'logo' => '/images/mitra/adira-finance.webp', 'height' => 'h-12 sm:h-14'],
            ['name' => 'RSI Sakinah Mojokerto', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'IT Corner', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'Mediatama', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'PT. Otak Kanan', 'kategori' => ['RPL'], 'logo' => '/images/mitra/otak-kanan.svg', 'height' => 'h-12 sm:h-14'],
            ['name' => 'PT. Sido Jodo', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
            ['name' => 'Maspion IT', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'PT. Smartfren Telecom, Tbk', 'kategori' => ['UMUM'], 'logo' => '/images/mitra/smartfren.svg', 'height' => 'h-10 sm:h-12'],
            ['name' => 'PT. Global Digital Pro', 'kategori' => ['UMUM'], 'logo' => null, 'height' => null],
            ['name' => 'PT. Parsaoran Global Datatrans (HSPnet)', 'kategori' => ['UMUM'], 'logo' => null, 'height' => null],
            ['name' => 'PT. Anekapay Teknologi Indonesia', 'kategori' => ['UMUM'], 'logo' => null, 'height' => null],
            ['name' => 'PT. Primafood International', 'kategori' => ['UMUM'], 'logo' => null, 'height' => null],
            ['name' => 'PT. Geoequator Indonesia', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'IT Brain Indonesia', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'PT. Minarsih Tech Mojokerto', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'PT. Bitniaga Cipta Gemilang', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'Topsell Mojokerto', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'Arasa Bakery', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
            ['name' => 'PROOF.CO', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'Hachi Donuts', 'kategori' => ['APHP'], 'logo' => '/images/mitra/hachi-donuts.svg', 'height' => 'h-12 sm:h-14'],
            ['name' => 'OurStudio', 'kategori' => ['DKV'], 'logo' => null, 'height' => null],
            ['name' => 'PT. Pilar Digital Indonesia', 'kategori' => ['DKV'], 'logo' => null, 'height' => null],
            ['name' => 'Bank Muamalat Cab. Mojokerto', 'kategori' => ['LPS'], 'logo' => '/images/mitra/bank-muamalat.svg', 'height' => 'h-12 sm:h-14'],
            ['name' => 'BTPN Syariah', 'kategori' => ['UMUM'], 'logo' => '/images/mitra/btpn-syariah.webp', 'height' => 'h-14 sm:h-16'],
            ['name' => 'JT. Shine', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'Favehotel Sidoarjo - East Java', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'Four Points by Sheraton Surabaya', 'kategori' => [], 'logo' => null, 'height' => null],
            ['name' => 'Sheraton Surabaya Hotel & Towers', 'kategori' => ['RPL', 'LPS', 'KULINER'], 'logo' => '/images/mitra/sheraton-surabaya.svg', 'height' => 'h-14 sm:h-16'],
            ['name' => 'PT. Universal Big Data (UBIG)', 'kategori' => ['RPL'], 'logo' => '/images/mitra/ubig.webp', 'height' => 'h-8 sm:h-10'],
            ['name' => 'Jagoan Hosting', 'kategori' => ['RPL'], 'logo' => '/images/mitra/jagoan-hosting.webp', 'height' => 'h-12 sm:h-14'],
            ['name' => 'Aston Hotel Mojokerto', 'kategori' => ['UMUM', 'RPL', 'LPS', 'KULINER'], 'logo' => '/images/mitra/aston-mojokerto.svg', 'height' => 'h-14 sm:h-16'],
            ['name' => 'PT. JACCS Mitra Pinasthika Mustika Finance', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'Dinas Kependudukan dan Pencatatan Sipil', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'Kantor Notaris Mirza Prima', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'Kantor Notaris dan PPAT Katarina', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'Lynn Hotel Mojokerto', 'kategori' => ['RPL'], 'logo' => null, 'height' => null],
            ['name' => 'Toko Mas Wahyuredjo', 'kategori' => ['UMUM'], 'logo' => null, 'height' => null],
            ['name' => 'CV. Teknos', 'kategori' => ['DKV'], 'logo' => '/images/mitra/teknos.svg', 'height' => 'h-14 sm:h-16'],
            ['name' => 'Percetakan Milenial Project', 'kategori' => ['DKV'], 'logo' => null, 'height' => null],
            ['name' => 'Amateras Bakery', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
            ['name' => 'Sigma Food', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
            ['name' => 'Nun Bakery', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
            ['name' => 'Nawasena\'s House', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
            ['name' => 'Sanrio Swalayan', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
            ['name' => 'Eni Cookies', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
            ['name' => 'The Southern Hotel', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'Pusat Oleh-Oleh Arasa', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
            ['name' => 'Yayasan Permata Mojokerto', 'kategori' => ['RPL', 'KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'UD. Family Food', 'kategori' => ['APHP'], 'logo' => '/images/mitra/family-food.svg', 'height' => 'h-12 sm:h-14'],
            ['name' => 'DKU Donuts', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
            ['name' => 'Ziebest Printing', 'kategori' => ['DKV'], 'logo' => null, 'height' => null],
            ['name' => 'Bank Mandiri Taspen', 'kategori' => ['LPS'], 'logo' => '/images/mitra/mandiri-taspen.svg', 'height' => 'h-12 sm:h-14'],
            ['name' => 'Ayola Sunrise Hotel Mojokerto', 'kategori' => ['RPL', 'LPS', 'KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'Movenpick Surabaya City - Mercure', 'kategori' => ['RPL', 'KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'BAZNAS Kota Mojokerto', 'kategori' => ['LPS'], 'logo' => '/images/mitra/baznas-mojokerto.svg', 'height' => 'h-14 sm:h-16'],
            ['name' => 'Zafision Digital Workshop', 'kategori' => ['DKV'], 'logo' => null, 'height' => null],
            ['name' => 'Utero Mojokerto', 'kategori' => ['DKV'], 'logo' => '/images/mitra/utero-indonesia.svg', 'height' => 'h-10 sm:h-12'],
            ['name' => 'Lily Bakery and Brownies', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
            ['name' => 'Java Studio', 'kategori' => ['DKV'], 'logo' => '/images/mitra/java-studio.svg', 'height' => 'h-14 sm:h-16'],
            ['name' => 'Ilham Camera', 'kategori' => ['DKV'], 'logo' => null, 'height' => null],
            ['name' => 'Gedung Rumah Besar Kemasan', 'kategori' => ['DKV'], 'logo' => null, 'height' => null],
            ['name' => 'Behind the Studio / Shaman', 'kategori' => ['DKV'], 'logo' => null, 'height' => null],
            ['name' => 'Difams Souvenir', 'kategori' => ['DKV'], 'logo' => null, 'height' => null],
            ['name' => 'Lynn Hotel Tuban', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'Manov Kopi', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'Sitarasa', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'Deavy Hantaran', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'Bagian Kesejahteraan Rakyat Sekretariat', 'kategori' => ['LPS'], 'logo' => null, 'height' => null],
            ['name' => 'Sensatype Studio', 'kategori' => ['DKV'], 'logo' => null, 'height' => null],
            ['name' => 'Casalamia Photo Studio', 'kategori' => ['DKV'], 'logo' => null, 'height' => null],
            ['name' => 'Aysha Catering', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'Vasa Hotel Surabaya', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'PT. Tiga Permata Development', 'kategori' => ['LPS'], 'logo' => null, 'height' => null],
            ['name' => 'Inisouvenir', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'Olivia Bakery Kota Mojokerto', 'kategori' => ['APHP'], 'logo' => '/images/mitra/olivia-bakery.svg', 'height' => 'h-14 sm:h-16'],
            ['name' => 'Full Space (Coffee & Eatery)', 'kategori' => ['KULINER'], 'logo' => null, 'height' => null],
            ['name' => 'BMT Permata', 'kategori' => ['LPS'], 'logo' => null, 'height' => null],
            ['name' => 'De\'Xavier Boulangerie & Patisserie', 'kategori' => ['APHP'], 'logo' => null, 'height' => null],
        ];
    }

    /**
     * Mitra untuk satu kategori jurusan (RPL, APHP, DKV, LPS, KULINER).
     *
     * @return array<int, array<string, mixed>>
     */
    public static function untuk(string $kategori): array
    {
        return array_values(array_map(
            fn (array $mitra) => array_diff_key($mitra, ['kategori' => true]),
            array_filter(self::semua(), fn (array $mitra) => in_array($kategori, $mitra['kategori'], true)),
        ));
    }
}
