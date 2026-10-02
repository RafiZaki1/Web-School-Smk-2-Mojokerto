export const ASPIRASI_KATEGORI = ["Fasilitas", "Pembelajaran", "Kedisiplinan", "Layanan Administrasi", "Lainnya"];

export const KATEGORI_ASPIRASI_TONES = {
  Fasilitas: "bg-[#e0e7ff] text-[#3730a3]",
  Pembelajaran: "bg-[#dcfce7] text-[#166534]",
  Kedisiplinan: "bg-[#fce7f3] text-[#9d174d]",
  "Layanan Administrasi": "bg-[#fef3c7] text-[#92400e]",
  Lainnya: "bg-[#f1f5f9] text-[#334155]",
};

export const STATUS_ASPIRASI_TONES = {
  Baru: "bg-[#fee2e2] text-[#b91c1c]",
  Diproses: "bg-[#dbeafe] text-[#1d4ed8]",
  Selesai: "bg-[#dcfce7] text-[#15803d]",
};

// Contoh aspirasi yang sudah ditindaklanjuti (halaman publik)
export const ASPIRASI_PUBLIK = [
  {
    kategori: "Fasilitas",
    status: "Selesai",
    judul: "Kipas angin kelas XII DKV 1 tidak berfungsi",
    tindakLanjut: "Ditindaklanjuti — perbaikan selesai 25 Agustus 2026",
  },
  {
    kategori: "Layanan Administrasi",
    status: "Diproses",
    judul: "Waktu tunggu pengurusan surat keterangan terlalu lama",
    tindakLanjut: "Sedang ditinjau oleh bagian Tata Usaha",
  },
];
