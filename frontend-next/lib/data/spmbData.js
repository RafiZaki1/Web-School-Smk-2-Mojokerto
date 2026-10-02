// tempat "Online" ditampilkan sebagai lencana
export const SPMB_JALUR = [
  {
    id: "pra-pendaftaran",
    label: "Pra Pendaftaran",
    jadwal: [
      { kegiatan: "Entry nilai rapor oleh kepala satuan pendidikan", tanggal: "18 - 23 Mei", jam: "-", tempat: "Sekolah asal" },
      { kegiatan: "Verifikasi nilai rapor oleh calon murid baru", tanggal: "23 - 27 Mei", jam: "-", tempat: "Online" },
      { kegiatan: "Pengambilan PIN oleh calon murid baru", tanggal: "1 - 19 Juni", jam: "00.01 - 21.00 WIB", tempat: "Online" },
      { kegiatan: "Verifikasi & validasi dokumen oleh operator sekolah", tanggal: "1 - 20 Juni", jam: "s.d 16.00 WIB", tempat: "Online/offline" },
      { kegiatan: "Latihan pendaftaran", tanggal: "8 - 10 Juni", jam: "09.00 - 16.00 WIB", tempat: "Online" },
    ],
  },
  {
    id: "afirmasi",
    label: "Afirmasi / Mutasi / Prestasi Lomba",
    jadwal: [
      { kegiatan: "Pendaftaran", tanggal: "18 - 23 Mei", jam: "00.01 - 21.00 WIB", tempat: "Online" },
      { kegiatan: "Penutupan", tanggal: "23 Mei", jam: "21.00 WIB", tempat: "Online" },
      { kegiatan: "Verifikasi & validasi oleh sekolah tujuan", tanggal: "26 - 30 Mei", jam: "s.d 16.00 WIB", tempat: "Online/offline" },
      { kegiatan: "Pengumuman", tanggal: "1 - 19 Juni", jam: "09.00 WIB", tempat: "Online" },
      { kegiatan: "Cetak bukti penerimaan oleh calon murid baru", tanggal: "1 - 20 Juni", jam: "09.00 - 23.59 WIB", tempat: "Online" },
      { kegiatan: "Latihan daftar ulang di sekolah tujuan", tanggal: "8 - 10 Juni", jam: "09.00 - 16.00 WIB", tempat: "Sekolah tujuan" },
    ],
  },
  {
    id: "domisili",
    label: "Domisili SMK",
    jadwal: [
      { kegiatan: "Pendaftaran", tanggal: "25 - 26 Juni", jam: "00.01 - 21.00 WIB", tempat: "Online" },
      { kegiatan: "Penutupan", tanggal: "26 Juni", jam: "21.00 WIB", tempat: "Online" },
      { kegiatan: "Pengumuman", tanggal: "27 Juni", jam: "08.00 WIB", tempat: "Online" },
      { kegiatan: "Cetak bukti penerimaan oleh calon murid baru", tanggal: "27 Juni", jam: "09.00 - 23.59 WIB", tempat: "Online" },
      { kegiatan: "Daftar ulang di sekolah tujuan", tanggal: "27 - 29 Juni", jam: "09.00 - 16.00 WIB", tempat: "Sekolah tujuan" },
      { kegiatan: "Pengumuman pemenuhan kuota", tanggal: "30 Juni", jam: "08.00 WIB", tempat: "Online" },
    ],
  },
  {
    id: "nilai-akademik",
    label: "Nilai Prestasi Akademik",
    jadwal: [
      { kegiatan: "Pendaftaran", tanggal: "1 - 2 Juli", jam: "00.01 - 21.00 WIB", tempat: "Online" },
      { kegiatan: "Penutupan", tanggal: "2 Juli", jam: "21.00 WIB", tempat: "Online" },
      { kegiatan: "Pengumuman", tanggal: "3 Juli", jam: "08.00 WIB", tempat: "Online" },
      { kegiatan: "Cetak bukti penerimaan oleh calon murid baru", tanggal: "3 Juli", jam: "09.00 - 23.59 WIB", tempat: "Online" },
      { kegiatan: "Daftar ulang di sekolah tujuan", tanggal: "3 - 4 Juli", jam: "09.00 - 16.00 WIB", tempat: "Sekolah tujuan" },
    ],
  },
];

export const SPMB_NILAI_2025 = [
  { kompetensi: "Layanan Perbankan Syariah", terdekat: "5.400 m", terjauh: "150 m", terendah: "87.90", tertinggi: "89.60" },
  { kompetensi: "Desain Komunikasi Visual", terdekat: "3.100 m", terjauh: "400 m", terendah: "88.70", tertinggi: "89.70" },
  { kompetensi: "Agribisnis Pengolahan Hasil Pertanian", terdekat: "1.600 m", terjauh: "300 m", terendah: "88.60", tertinggi: "90.10" },
  { kompetensi: "Kuliner", terdekat: "2.900 m", terjauh: "850 m", terendah: "87.80", tertinggi: "89.90" },
  { kompetensi: "Rekayasa Perangkat Lunak", terdekat: "2.400 m", terjauh: "380 m", terendah: "87.10", tertinggi: "89.20" },
];

export const SPMB_DOMISILI = [
  { label: "Domisili Kab./Kota Mojokerto", value: 57, color: "#1e40af" },
  { label: "Domisili Luar Mojokerto", value: 43, color: "#93c5fd" },
];
