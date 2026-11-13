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

// Jalur prestasi akademik: rata = (60% × rapor) + (40% × TKA).
// Rata-rata tiap jurusan berada di rentang 70,00–80,00 dan sangat sedikit pendaftar di atas 90,00.
export const SPMB_NILAI_2025 = [
  { kompetensi: "Rekayasa Perangkat Lunak", rapor: "85,20", tka: "66,50", rata: "77,72", terendah: "72,10", tertinggi: "91,24", di_atas_90: 2 },
  { kompetensi: "Desain Komunikasi Visual", rapor: "84,60", tka: "64,80", rata: "76,68", terendah: "71,35", tertinggi: "90,18", di_atas_90: 1 },
  { kompetensi: "Layanan Perbankan Syariah", rapor: "83,90", tka: "61,40", rata: "74,90", terendah: "69,80", tertinggi: "86,42", di_atas_90: 0 },
  { kompetensi: "Kuliner", rapor: "83,40", tka: "59,70", rata: "73,92", terendah: "68,95", tertinggi: "85,76", di_atas_90: 0 },
  { kompetensi: "Agribisnis Pengolahan Hasil Pertanian", rapor: "82,80", tka: "58,20", rata: "72,96", terendah: "68,20", tertinggi: "84,90", di_atas_90: 0 },
];

/** Singkatan dan warna lencana tiap kompetensi keahlian di tabel nilai dan kalkulator */
export const KODE_JURUSAN: Record<string, { kode: string; tone: string }> = {
  "Rekayasa Perangkat Lunak": { kode: "RPL", tone: "bg-primary/15 text-primary" },
  "Desain Komunikasi Visual": { kode: "DKV", tone: "bg-sun/35 text-sun-ink" },
  "Layanan Perbankan Syariah": { kode: "LPS", tone: "bg-navy/15 text-navy-ink" },
  Kuliner: { kode: "TB", tone: "bg-lime-soft text-lime-ink" },
  "Agribisnis Pengolahan Hasil Pertanian": { kode: "APHP", tone: "bg-green/15 text-green" },
};

export const SPMB_RENTANG_SEBARAN = [
  {
    rentang: "70,00 – 80,00",
    kategori: "Mayoritas / Rata-Rata Umum",
    persentase: "68,5%",
    porsiBar: 68.5,
    status: "dominan" as const,
    keterangan: "Rentang rata-rata umum pendaftar yang diterima di SMK Negeri wilayah Mojokerto",
  },
  {
    rentang: "80,01 – 90,00",
    kategori: "Di Atas Rata-Rata",
    persentase: "18,3%",
    porsiBar: 18.3,
    status: "tinggi" as const,
    keterangan: "Pendaftar dengan capaian rapor & TKA tinggi, peluang diterima sangat kuat",
  },
  {
    rentang: "< 70,00",
    kategori: "Di Bawah Rata-Rata",
    persentase: "12,0%",
    porsiBar: 12.0,
    status: "bawah" as const,
    keterangan: "Masih berpeluang diterima menyesuaikan daya tampung kompetensi keahlian",
  },
  {
    rentang: "> 90,00",
    kategori: "Sangat Sedikit",
    persentase: "1,2%",
    porsiBar: 5.0,
    status: "jarang" as const,
    keterangan: "Sangat sedikit pendaftar yang memiliki nilai gabungan menembus di atas 90,00",
  },
] as const;

export const SPMB_SIMULASI_GABUNGAN = [
  { rapor: "84,00", hasilRapor: "50,40", tka: "68,00", hasilTka: "27,20", gabungan: "77,60", posisi: "Rentang Rata-Rata (70–80)" },
  { rapor: "82,00", hasilRapor: "49,20", tka: "66,00", hasilTka: "26,40", gabungan: "75,60", posisi: "Rentang Rata-Rata (70–80)" },
  { rapor: "80,00", hasilRapor: "48,00", tka: "60,00", hasilTka: "24,00", gabungan: "72,00", posisi: "Rentang Rata-Rata (70–80)" },
  { rapor: "92,00", hasilRapor: "55,20", tka: "88,00", hasilTka: "35,20", gabungan: "90,40", posisi: "Di Atas 90,00 (Sangat Jarang)" },
] as const;

export const SPMB_DOMISILI = [
  { label: "Domisili Kab./Kota Mojokerto", value: 57, color: "#0a6a97" },
  { label: "Domisili Luar Mojokerto", value: 43, color: "#f7d51d" },
];
