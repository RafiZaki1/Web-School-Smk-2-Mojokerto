/**
 * Data cerita PKL siswa per jurusan untuk section "Pengalaman PKL Siswa".
 *
 * CATATAN: nama siswa, perusahaan, cerita, dan path foto di bawah adalah CONTOH.
 * Ganti dengan data asli (dan izin tertulis dari siswa serta industri) sebelum dipublikasikan.
 * Foto letakkan di public/images/pkl/ sesuai path yang tertulis. Jika file belum ada,
 * komponen menampilkan placeholder otomatis.
 * Foto tampil dalam bingkai bulat: gunakan pas foto persegi (1:1), minimal 300×300 px,
 * dengan wajah di tengah-atas karena potongan difokuskan ke bagian atas.
 */

export const PKL_TABS = ["rpl", "dkv", "kuliner", "perbankan", "aphp"] as const;

export type PklTab = (typeof PKL_TABS)[number];

export interface PklStory {
  label: string;
  jurusan: string;
  lokasi: string;
  nama: string;
  perusahaan: string;
  kutipan: string;
  foto: { src: string; alt: string };
}

export const PKL_STORIES: Record<PklTab, PklStory> = {
  rpl: {
    label: "RPL / Gim",
    jurusan: "Rekayasa Perangkat Lunak",
    lokasi: "Bandung",
    nama: "Aditya Pratama",
    perusahaan: "PT Sinar Digital Solusi",
    kutipan:
      "PKL di luar kota itu berat banget di awal—harus mandiri dan ngejar ritme industri. Tapi di sini mental dan skill saya bener-bener ditempa untuk siap kerja.",
    foto: { src: "/images/fasilitas/rpl-1.jpg", alt: "Aditya Pratama sedang fokus bekerja di depan layar pengembangan" },
  },

  dkv: {
    label: "DKV",
    jurusan: "Desain Komunikasi Visual",
    lokasi: "Surabaya",
    nama: "Nadia Kusuma",
    perusahaan: "CV Kreasi Ruang Visual",
    kutipan:
      "Briefing klien pertama saya langsung minta revisi tiga kali. Dari situ saya belajar bahwa ide bagus saja tidak cukup, harus bisa dipertanggungjawabkan.",
    foto: { src: "/images/fasilitas/dkv-2.jpg", alt: "Nadia Kusuma sedang menata layout di meja desain" },
  },

  kuliner: {
    label: "Kuliner",
    jurusan: "Kuliner",
    lokasi: "Malang",
    nama: "Salsabila Rahma",
    perusahaan: "Restoran Taman Rasa",
    kutipan:
      "Dapur profesional ritmenya cepat banget. Minggu pertama saya cuma bisa mengiris bawang, tapi lama-lama saya dipercaya memegang station sendiri.",
    foto: { src: "/images/fasilitas/tb-1.jpg", alt: "Salsabila Rahma sedang menyiapkan hidangan di dapur restoran" },
  },

  perbankan: {
    label: "Perbankan",
    jurusan: "Perbankan",
    lokasi: "Yogyakarta",
    nama: "Rizky Ramadhan",
    perusahaan: "BPR Sumber Makmur",
    kutipan:
      "Berhadapan langsung dengan nasabah ternyata beda banget sama teori di kelas. Saya belajar sabar, teliti, dan menjaga kepercayaan orang.",
    foto: { src: "/images/fasilitas/lps-2.jpg", alt: "Rizky Ramadhan sedang melayani nasabah di meja teller" },
  },

  aphp: {
    label: "APHP",
    jurusan: "APHP",
    lokasi: "Sidoarjo",
    nama: "Dewi Anggraini",
    perusahaan: "PT Agro Lestari Nusantara",
    kutipan:
      "Di pabrik olahan, standar kebersihan dan kualitas itu harga mati. Dari situ saya paham bahwa satu tahap kecil saja bisa menentukan mutu produk.",
    foto: { src: "/images/fasilitas/aphp-1.jpg", alt: "Dewi Anggraini sedang memeriksa bahan baku di lini produksi" },
  },
};
