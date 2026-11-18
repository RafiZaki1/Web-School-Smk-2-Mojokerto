export type JurusanKey =
  | 'RPL'
  | 'LPS'
  | 'DKV'
  | 'APHP'
  | 'KUL'
  | 'UMUM'
  | 'FASILITAS';

export type BuildingVariant =
  | 'standard'
  | 'two_story'
  | 'gedung_utama'
  | 'musholla'
  | 'lapangan'
  | 'parkir_motor'
  | 'parkir_mobil'
  | 'taman'
  | 'upacara'
  | 'pos_satpam';

export interface CampusBuilding {
  id: string;
  nama: string;
  jurusan: JurusanKey;
  kelas: string;
  posisi: [number, number, number];
  ukuran: [number, number, number];
  warna: string;
  rotasi?: [number, number, number];
  lantai?: 1 | 2;
  variant?: BuildingVariant;
  deskripsi?: string;
  rute?: [number, number, number][];
  zona?: string;
  akses?: 'publik' | 'privat';
}

export function getZoneForPosition(
  x: number,
  z: number,
): { zona: string; akses: 'publik' | 'privat'; areaLabel: string } {
  // Cek apakah avatar berada di dekat gedung dengan zona khusus
  for (const b of CAMPUS_BUILDINGS) {
    const hw = b.ukuran[0] / 2 + 3.5;
    const hd = b.ukuran[2] / 2 + 3.5;
    if (
      Math.abs(x - b.posisi[0]) <= hw &&
      Math.abs(z - b.posisi[2]) <= hd
    ) {
      return {
        zona: b.zona ?? b.nama,
        akses: b.akses ?? 'publik',
        areaLabel: b.zona ?? b.nama,
      };
    }
  }

  // Fallback kawasan berdasarkan kuadran denah sekolah
  if (z < -22) {
    return { zona: 'Area Gerbang & Utama', akses: 'publik', areaLabel: 'Kawasan Gerbang & Utama' };
  }
  if (x < -30 && z < 16) {
    return { zona: 'Blok RPL & Perpustakaan', akses: 'publik', areaLabel: 'Kawasan Blok RPL' };
  }
  if (x >= -30 && x <= 40 && z < 16) {
    return { zona: 'Taman & Blok APHP/DKV', akses: 'publik', areaLabel: 'Kawasan Taman & APHP' };
  }
  if (x > 40 && z < 20) {
    return { zona: 'Blok LPS & DKV Timur', akses: 'publik', areaLabel: 'Kawasan Blok Timur' };
  }
  return { zona: 'Area Aula, Lapangan & Lab', akses: 'publik', areaLabel: 'Kawasan Selatan Sekolah' };
}

export const GERBANG_UTAMA_POS: [number, number, number] = [0, 0.4, -52.5];

export const JURUSAN_COLORS: Record<JurusanKey, string> = {
  RPL: '#f48fb1', // Merah muda / salmon
  LPS: '#78909c', // Abu-abu kebiruan
  DKV: '#6b8e23', // Hijau zaitun
  APHP: '#fb923c', // Oranye / peach
  KUL: '#f59e0b', // Kuning hangat / kuliner
  UMUM: '#eab308', // Kuning (Aula, Perpustakaan, Kantin, TETA)
  FASILITAS: '#e7dcc8', // Krem / beige netral
};

export const JURUSAN_LABELS: Record<JurusanKey, string> = {
  RPL: 'Rekayasa Perangkat Lunak (RPL)',
  LPS: 'Layanan Perbankan Syariah (LPS)',
  DKV: 'Desain Komunikasi Visual (DKV)',
  APHP: 'Agribisnis Pengolahan Hasil Pertanian (APHP)',
  KUL: 'Kuliner / Tata Boga',
  UMUM: 'Ruang Umum & Penunjang',
  FASILITAS: 'Fasilitas & Layanan Sekolah',
};

export const CAMPUS_BOUNDS = {
  width: 200,
  depth: 110,
};

export const CAMPUS_BUILDINGS: CampusBuilding[] = [
  // =========================================================
  // GERBANG UTARA, POS SATPAM, DAN PARKIR ATAS
  // =========================================================
  {
    id: 'gerbang-utama',
    nama: 'Gerbang Utama',
    jurusan: 'FASILITAS',
    kelas: 'Pintu Masuk Utama',
    posisi: [0, 0, -52.5],
    ukuran: [11, 3.6, 2],
    warna: '#cbd5e1',
    variant: 'pos_satpam',
    deskripsi: 'Titik awal akses masuk kompleks SMK Negeri 2 Mojokerto di sisi utara.',
  },
  {
    id: 'pos-satpam',
    nama: 'Pos Satpam',
    jurusan: 'FASILITAS',
    kelas: 'Keamanan',
    posisi: [0, 0, -48],
    ukuran: [5.5, 3.2, 4.2],
    warna: '#e7dcc8',
    variant: 'pos_satpam',
    deskripsi: 'Pos penjagaan gerbang utama SMK Negeri 2 Mojokerto.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -48],
    ],
  },
  {
    id: 'parkir-motor-atas',
    nama: 'Parkir Motor',
    jurusan: 'FASILITAS',
    kelas: 'Area Parkir',
    posisi: [-26, 0, -43],
    ukuran: [18, 0.4, 9],
    warna: '#cbd5e1',
    variant: 'parkir_motor',
    deskripsi: 'Area parkir sepeda motor di sisi utara dekat gerbang.',
  },
  {
    id: 'parkir-mobil-atas',
    nama: 'Parkir Mobil',
    jurusan: 'FASILITAS',
    kelas: 'Area Parkir',
    posisi: [26, 0, -43],
    ukuran: [18, 0.4, 9],
    warna: '#cbd5e1',
    variant: 'parkir_mobil',
    deskripsi: 'Area parkir mobil tamu, guru, dan karyawan.',
  },

  // =========================================================
  // GEDUNG UTAMA (TENGAH ATAS)
  // =========================================================
  {
    id: 'gedung-utama',
    nama: 'Gedung Utama',
    jurusan: 'FASILITAS',
    kelas: 'Kantor & Manajemen',
    posisi: [0, 0, -30],
    ukuran: [28, 8.6, 10],
    warna: '#f4e7d3',
    lantai: 2,
    variant: 'gedung_utama',
    zona: 'Kantor Manajemen & TU',
    akses: 'privat',
    deskripsi:
      'Gedung pusat administrasi dua lantai dengan pilar depan, tiang bendera merah-putih, dan air mancur.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [0, 0.4, -34],
    ],
  },

  // =========================================================
  // DERETAN KANAN ATAS: R. BKK, TOKO SEKOLAH, BANK MINI
  // =========================================================
  {
    id: 'r-bkk',
    nama: 'R. BKK',
    jurusan: 'FASILITAS',
    kelas: 'Bursa Kerja Khusus',
    posisi: [48, 0, -39],
    ukuran: [9, 4.2, 7],
    warna: '#e7dcc8',
    deskripsi: 'Ruang Bursa Kerja Khusus untuk penyaluran kerja alumni.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [48, 0.4, -37],
      [48, 0.4, -39],
    ],
  },
  {
    id: 'toko-sekolah',
    nama: 'Toko Sekolah',
    jurusan: 'FASILITAS',
    kelas: 'Unit Produksi',
    posisi: [59, 0, -39],
    ukuran: [9, 4.2, 7],
    warna: '#e7dcc8',
    deskripsi: 'Toko sekolah penyedia atribut, alat tulis, dan produk siswa.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [59, 0.4, -37],
      [59, 0.4, -39],
    ],
  },
  {
    id: 'bank-mini',
    nama: 'Bank Mini',
    jurusan: 'LPS',
    kelas: 'Layanan Keuangan',
    posisi: [70, 0, -39],
    ukuran: [9, 4.2, 7],
    warna: JURUSAN_COLORS.LPS,
    zona: 'Ruang Brankas & Layanan Bank Mini',
    akses: 'privat',
    deskripsi: 'Bank Mini sekolah untuk praktik LPS dan transaksi siswa.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [70, 0.4, -37],
      [70, 0.4, -39],
    ],
  },

  // =========================================================
  // GEDUNG KIRI ATAS (DUA BANGUNAN)
  // =========================================================
  {
    id: 'r-bk',
    nama: 'R. BK',
    jurusan: 'FASILITAS',
    kelas: 'Bimbingan Konseling',
    posisi: [-84, 0, -39],
    ukuran: [8, 4.2, 7],
    warna: '#e7dcc8',
    deskripsi: 'Ruang Bimbingan dan Konseling siswa.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -33.5],
      [-84, 0.4, -33.5],
      [-84, 0.4, -39],
    ],
  },
  {
    id: 'lab-lps-atas',
    nama: 'LAB LPS',
    jurusan: 'LPS',
    kelas: 'Laboratorium',
    posisi: [-73, 0, -39],
    ukuran: [10, 4.2, 7],
    warna: JURUSAN_COLORS.LPS,
    deskripsi: 'Laboratorium praktik Layanan Perbankan Syariah.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -33.5],
      [-73, 0.4, -33.5],
      [-73, 0.4, -39],
    ],
  },
  {
    id: 'lab-dkv-atas-1',
    nama: 'LAB DKV',
    jurusan: 'DKV',
    kelas: 'Laboratorium',
    posisi: [-61, 0, -39],
    ukuran: [10, 4.2, 7],
    warna: JURUSAN_COLORS.DKV,
    deskripsi: 'Laboratorium komputer dan desain grafis DKV.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -33.5],
      [-61, 0.4, -33.5],
      [-61, 0.4, -39],
    ],
  },
  {
    id: 'ssk',
    nama: 'SSK',
    jurusan: 'FASILITAS',
    kelas: 'Sekolah Siaga Kependudukan',
    posisi: [-85, 0, -28],
    ukuran: [7, 4, 6.5],
    warna: '#e7dcc8',
    deskripsi: 'Pojok Sekolah Siaga Kependudukan.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -33.5],
      [-85, 0.4, -33.5],
      [-85, 0.4, -28],
    ],
  },
  {
    id: 'uks',
    nama: 'UKS',
    jurusan: 'FASILITAS',
    kelas: 'Kesehatan Sekolah',
    posisi: [-76, 0, -28],
    ukuran: [7, 4, 6.5],
    warna: '#e7dcc8',
    deskripsi: 'Unit Kesehatan Sekolah.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -33.5],
      [-76, 0.4, -33.5],
      [-76, 0.4, -28],
    ],
  },
  {
    id: 'lab-kuliner-atas',
    nama: 'LAB. KULINER',
    jurusan: 'KUL',
    kelas: 'Laboratorium',
    posisi: [-65, 0, -28],
    ukuran: [10, 4, 6.5],
    warna: JURUSAN_COLORS.KUL,
    deskripsi: 'Laboratorium praktik pengolahan makanan jurusan Kuliner.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -33.5],
      [-65, 0.4, -33.5],
      [-65, 0.4, -28],
    ],
  },
  {
    id: 'lab-dkv-atas-2',
    nama: 'LAB. DKV',
    jurusan: 'DKV',
    kelas: 'Laboratorium',
    posisi: [-53, 0, -28],
    ukuran: [10, 4, 6.5],
    warna: JURUSAN_COLORS.DKV,
    deskripsi: 'Laboratorium fotografi dan produksi media DKV.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -33.5],
      [-53, 0.4, -33.5],
      [-53, 0.4, -28],
    ],
  },

  // =========================================================
  // MUSHOLLA (KIRI ATAS TENGAH, KUBAH HIJAU)
  // =========================================================
  {
    id: 'musholla',
    nama: 'Musholla',
    jurusan: 'UMUM',
    kelas: 'Tempat Ibadah',
    posisi: [-36, 0, -26],
    ukuran: [11, 5, 11],
    warna: '#f4e7d3',
    variant: 'musholla',
    deskripsi: 'Musholla sekolah dengan kubah hijau di sisi kiri tengah.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -26],
      [-36, 0.4, -26],
    ],
  },

  // =========================================================
  // PERPUSTAKAAN (KIRI TENGAH) DENGAN LABEL X RPL 1
  // =========================================================
  {
    id: 'perpustakaan-x-rpl-1',
    nama: 'Perpustakaan (X RPL 1)',
    jurusan: 'UMUM',
    kelas: 'X RPL 1 / Perpustakaan',
    posisi: [-80, 0, -5],
    ukuran: [14, 5.2, 13],
    warna: JURUSAN_COLORS.UMUM,
    deskripsi: 'Gedung Perpustakaan sekolah sekaligus ruang berlabel X RPL 1.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -19],
      [-68, 0.4, -19],
      [-68, 0.4, -5],
      [-80, 0.4, -5],
    ],
  },

  // =========================================================
  // BLOK RUANG KELAS RPL KIRI (2 KOLOM x 4 RUANGAN BERTINGKAT)
  // =========================================================
  // Kolom kiri
  {
    id: 'rpl-xi-2',
    nama: 'XI RPL 2',
    jurusan: 'RPL',
    kelas: 'XI RPL 2',
    posisi: [-58, 0, -14],
    ukuran: [9.5, 3.6, 6.2],
    warna: JURUSAN_COLORS.RPL,
    lantai: 2,
    variant: 'two_story',
    deskripsi: 'Ruang pembelajaran kelas XI RPL 2 pada blok RPL kolom kiri (bertingkat).',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -19],
      [-58, 0.4, -19],
      [-58, 0.4, -14],
    ],
  },
  {
    id: 'rpl-xi-1',
    nama: 'XI RPL 1',
    jurusan: 'RPL',
    kelas: 'XI RPL 1',
    posisi: [-58, 0, -6],
    ukuran: [9.5, 3.6, 6.2],
    warna: JURUSAN_COLORS.RPL,
    lantai: 2,
    variant: 'two_story',
    deskripsi: 'Ruang pembelajaran kelas XI RPL 1 pada blok RPL kolom kiri (bertingkat).',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -19],
      [-68, 0.4, -19],
      [-68, 0.4, -6],
      [-58, 0.4, -6],
    ],
  },
  {
    id: 'rpl-x-2',
    nama: 'X RPL 2',
    jurusan: 'RPL',
    kelas: 'X RPL 2',
    posisi: [-58, 0, 2],
    ukuran: [9.5, 3.6, 6.2],
    warna: JURUSAN_COLORS.RPL,
    lantai: 2,
    variant: 'two_story',
    deskripsi: 'Ruang pembelajaran kelas X RPL 2 pada blok RPL kolom kiri (bertingkat).',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -19],
      [-68, 0.4, -19],
      [-68, 0.4, 2],
      [-58, 0.4, 2],
    ],
  },
  {
    id: 'rpl-x-3',
    nama: 'X RPL 3',
    jurusan: 'RPL',
    kelas: 'X RPL 3',
    posisi: [-58, 0, 10],
    ukuran: [9.5, 3.6, 6.2],
    warna: JURUSAN_COLORS.RPL,
    lantai: 2,
    variant: 'two_story',
    deskripsi: 'Ruang pembelajaran kelas X RPL 3 pada blok RPL kolom kiri (bertingkat).',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -19],
      [-68, 0.4, -19],
      [-68, 0.4, 15.5],
      [-58, 0.4, 15.5],
      [-58, 0.4, 10],
    ],
  },
  // Kolom kanan
  {
    id: 'rpl-xi-3',
    nama: 'XI RPL 3',
    jurusan: 'RPL',
    kelas: 'XI RPL 3',
    posisi: [-43, 0, -14],
    ukuran: [9.5, 3.6, 6.2],
    warna: JURUSAN_COLORS.RPL,
    lantai: 2,
    variant: 'two_story',
    deskripsi: 'Ruang pembelajaran kelas XI RPL 3 pada blok RPL kolom kanan (bertingkat).',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -19],
      [-43, 0.4, -19],
      [-43, 0.4, -14],
    ],
  },
  {
    id: 'rpl-xii-1',
    nama: 'XII RPL 1',
    jurusan: 'RPL',
    kelas: 'XII RPL 1',
    posisi: [-43, 0, -6],
    ukuran: [9.5, 3.6, 6.2],
    warna: JURUSAN_COLORS.RPL,
    lantai: 2,
    variant: 'two_story',
    deskripsi: 'Ruang pembelajaran kelas XII RPL 1 pada blok RPL kolom kanan (bertingkat).',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, -6],
      [-43, 0.4, -6],
    ],
  },
  {
    id: 'rpl-xii-2',
    nama: 'XII RPL 2',
    jurusan: 'RPL',
    kelas: 'XII RPL 2',
    posisi: [-43, 0, 2],
    ukuran: [9.5, 3.6, 6.2],
    warna: JURUSAN_COLORS.RPL,
    lantai: 2,
    variant: 'two_story',
    deskripsi: 'Ruang pembelajaran kelas XII RPL 2 pada blok RPL kolom kanan (bertingkat).',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 2],
      [-43, 0.4, 2],
    ],
  },
  {
    id: 'rpl-xii-3',
    nama: 'XII RPL 3',
    jurusan: 'RPL',
    kelas: 'XII RPL 3',
    posisi: [-43, 0, 10],
    ukuran: [9.5, 3.6, 6.2],
    warna: JURUSAN_COLORS.RPL,
    lantai: 2,
    variant: 'two_story',
    deskripsi: 'Ruang pembelajaran kelas XII RPL 3 pada blok RPL kolom kanan (bertingkat).',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-43, 0.4, 15.5],
      [-43, 0.4, 10],
    ],
  },

  // =========================================================
  // LAPANGAN UPACARA PENUH (TENGAH KOMPLEKS, DEPAN GEDUNG UTAMA)
  // =========================================================
  {
    id: 'lapangan-upacara',
    nama: 'Lapangan Upacara',
    jurusan: 'UMUM',
    kelas: 'Lapangan Upacara',
    posisi: [4.5, 0, -1.75],
    ukuran: [56, 0.35, 27],
    warna: '#22c55e',
    variant: 'upacara',
    deskripsi:
      'Lapangan upacara utama di tengah kompleks sekolah di depan Gedung Utama.',
  },

  // =========================================================
  // BLOK APHP DAN DKV DI PINGGIR TIMUR AULA (2 BARIS x 4 KOLOM)
  // =========================================================
  // Baris atas
  {
    id: 'aphp-xii-2',
    nama: 'XII APHP 2',
    jurusan: 'APHP',
    kelas: 'XII APHP 2',
    posisi: [6, 0, 21],
    ukuran: [9.2, 2.8, 6.2],
    warna: JURUSAN_COLORS.APHP,
    deskripsi: 'Ruang pembelajaran kelas XII APHP 2 pada blok tengah-kanan baris atas.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [-1, 0.4, 21],
      [6, 0.4, 21],
    ],
  },
  {
    id: 'aphp-xii-1',
    nama: 'XII APHP 1',
    jurusan: 'APHP',
    kelas: 'XII APHP 1',
    posisi: [16.2, 0, 21],
    ukuran: [9.2, 2.8, 6.2],
    warna: JURUSAN_COLORS.APHP,
    deskripsi: 'Ruang pembelajaran kelas XII APHP 1 pada blok tengah-kanan baris atas.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [16.2, 0.4, 15.5],
      [16.2, 0.4, 21],
    ],
  },
  {
    id: 'dkv-xii-2',
    nama: 'XII DKV 2',
    jurusan: 'DKV',
    kelas: 'XII DKV 2',
    posisi: [27.4, 0, 21],
    ukuran: [9.2, 2.8, 6.2],
    warna: JURUSAN_COLORS.DKV,
    deskripsi: 'Ruang pembelajaran kelas XII DKV 2 pada blok tengah-kanan baris atas.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, 15.5],
      [27.4, 0.4, 15.5],
      [27.4, 0.4, 21],
    ],
  },
  {
    id: 'dkv-xii-1',
    nama: 'XII DKV 1',
    jurusan: 'DKV',
    kelas: 'XII DKV 1',
    posisi: [37.6, 0, 21],
    ukuran: [9.2, 2.8, 6.2],
    warna: JURUSAN_COLORS.DKV,
    deskripsi: 'Ruang pembelajaran kelas XII DKV 1 pada blok tengah-kanan baris atas.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, 21],
      [37.6, 0.4, 21],
    ],
  },
  // Baris bawah
  {
    id: 'aphp-x-2',
    nama: 'X APHP 2',
    jurusan: 'APHP',
    kelas: 'X APHP 2',
    posisi: [6, 0, 28.2],
    ukuran: [9.2, 2.8, 6.2],
    warna: JURUSAN_COLORS.APHP,
    deskripsi: 'Ruang pembelajaran kelas X APHP 2 pada blok tengah-kanan baris bawah.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [-1, 0.4, 28.2],
      [6, 0.4, 28.2],
    ],
  },
  {
    id: 'aphp-x-1',
    nama: 'X APHP 1',
    jurusan: 'APHP',
    kelas: 'X APHP 1',
    posisi: [16.2, 0, 28.2],
    ukuran: [9.2, 2.8, 6.2],
    warna: JURUSAN_COLORS.APHP,
    deskripsi: 'Ruang pembelajaran kelas X APHP 1 pada blok tengah-kanan baris bawah.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [-1, 0.4, 36.5],
      [16.2, 0.4, 36.5],
      [16.2, 0.4, 28.2],
    ],
  },
  {
    id: 'dkv-x-2',
    nama: 'X DKV 2',
    jurusan: 'DKV',
    kelas: 'X DKV 2',
    posisi: [27.4, 0, 28.2],
    ukuran: [9.2, 2.8, 6.2],
    warna: JURUSAN_COLORS.DKV,
    deskripsi: 'Ruang pembelajaran kelas X DKV 2 pada blok tengah-kanan baris bawah.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, 36.5],
      [27.4, 0.4, 36.5],
      [27.4, 0.4, 28.2],
    ],
  },
  {
    id: 'dkv-x-1',
    nama: 'X DKV 1',
    jurusan: 'DKV',
    kelas: 'X DKV 1',
    posisi: [37.6, 0, 28.2],
    ukuran: [9.2, 2.8, 6.2],
    warna: JURUSAN_COLORS.DKV,
    deskripsi: 'Ruang pembelajaran kelas X DKV 1 pada blok tengah-kanan baris bawah.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, 28.2],
      [37.6, 0.4, 28.2],
    ],
  },

  // =========================================================
  // BLOK LPS / DKV KANAN (2 KOLOM x 4 RUANGAN)
  // =========================================================
  // Kolom kiri
  {
    id: 'lps-xii-1',
    nama: 'XII LPS 1',
    jurusan: 'LPS',
    kelas: 'XII LPS 1',
    posisi: [51, 0, -14],
    ukuran: [9.5, 2.8, 6.2],
    warna: JURUSAN_COLORS.LPS,
    deskripsi: 'Ruang pembelajaran kelas XII LPS 1 pada blok timur kolom kiri.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, -14],
      [51, 0.4, -14],
    ],
  },
  {
    id: 'lps-xii-2',
    nama: 'XII LPS 2',
    jurusan: 'LPS',
    kelas: 'XII LPS 2',
    posisi: [51, 0, -6],
    ukuran: [9.5, 2.8, 6.2],
    warna: JURUSAN_COLORS.LPS,
    deskripsi: 'Ruang pembelajaran kelas XII LPS 2 pada blok timur kolom kiri.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, -6],
      [51, 0.4, -6],
    ],
  },
  {
    id: 'kanan-xii-dkv-1',
    nama: 'XII DKV 1 (Blok Timur)',
    jurusan: 'DKV',
    kelas: 'XII DKV 1',
    posisi: [51, 0, 2],
    ukuran: [9.5, 2.8, 6.2],
    warna: JURUSAN_COLORS.DKV,
    deskripsi: 'Ruang pembelajaran kelas XII DKV 1 pada blok timur kolom kiri (sisi selatan blok LPS).',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, 2],
      [51, 0.4, 2],
    ],
  },
  {
    id: 'dkv-xi-2',
    nama: 'XI DKV 2',
    jurusan: 'DKV',
    kelas: 'XI DKV 2',
    posisi: [51, 0, 10],
    ukuran: [9.5, 2.8, 6.2],
    warna: JURUSAN_COLORS.DKV,
    deskripsi: 'Ruang pembelajaran kelas XI DKV 2 pada blok timur kolom kiri.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, 10],
      [51, 0.4, 10],
    ],
  },
  // Kolom kanan
  {
    id: 'lps-x-1',
    nama: 'X LPS 1',
    jurusan: 'LPS',
    kelas: 'X LPS 1',
    posisi: [63, 0, -14],
    ukuran: [9.5, 2.8, 6.2],
    warna: JURUSAN_COLORS.LPS,
    deskripsi: 'Ruang pembelajaran kelas X LPS 1 pada blok timur kolom kanan.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, -19],
      [63, 0.4, -19],
      [63, 0.4, -14],
    ],
  },
  {
    id: 'lps-x-2',
    nama: 'X LPS 2',
    jurusan: 'LPS',
    kelas: 'X LPS 2',
    posisi: [63, 0, -6],
    ukuran: [9.5, 2.8, 6.2],
    warna: JURUSAN_COLORS.LPS,
    deskripsi: 'Ruang pembelajaran kelas X LPS 2 pada blok timur kolom kanan.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, -19],
      [72, 0.4, -19],
      [72, 0.4, -6],
      [63, 0.4, -6],
    ],
  },
  {
    id: 'lps-xi-1',
    nama: 'XI LPS 1',
    jurusan: 'LPS',
    kelas: 'XI LPS 1',
    posisi: [63, 0, 2],
    ukuran: [9.5, 2.8, 6.2],
    warna: JURUSAN_COLORS.LPS,
    deskripsi: 'Ruang pembelajaran kelas XI LPS 1 pada blok timur kolom kanan.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, 15.5],
      [72, 0.4, 15.5],
      [72, 0.4, 2],
      [63, 0.4, 2],
    ],
  },
  {
    id: 'lps-xi-2',
    nama: 'XI LPS 2',
    jurusan: 'LPS',
    kelas: 'XI LPS 2',
    posisi: [63, 0, 10],
    ukuran: [9.5, 2.8, 6.2],
    warna: JURUSAN_COLORS.LPS,
    deskripsi: 'Ruang pembelajaran kelas XI LPS 2 pada blok timur kolom kanan.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, 15.5],
      [63, 0.4, 15.5],
      [63, 0.4, 10],
    ],
  },

  // =========================================================
  // PARKIR MOTOR SISWA (SISI KANAN)
  // =========================================================
  {
    id: 'parkir-motor-siswa',
    nama: 'Parkir Motor Siswa',
    jurusan: 'FASILITAS',
    kelas: 'Area Parkir',
    posisi: [82, 0, -2],
    ukuran: [15, 0.4, 28],
    warna: '#cbd5e1',
    variant: 'parkir_motor',
    deskripsi: 'Area parkir motor siswa dengan deretan kendaraan di sisi timur.',
  },

  // =========================================================
  // LAPANGAN OLAHRAGA (KIRI BAWAH)
  // =========================================================
  {
    id: 'lapangan-olahraga',
    nama: 'Lapangan Olahraga',
    jurusan: 'UMUM',
    kelas: 'Lapangan Basket & Upacara',
    posisi: [-74, 0, 24],
    ukuran: [28, 0.35, 19],
    warna: '#ea580c',
    variant: 'lapangan',
    deskripsi: 'Lapangan basket oranye-biru dengan garis putih di sisi barat daya.',
  },

  // =========================================================
  // DERETAN ENAM RUMAH KECIL BAGIAN BAWAH KIRI (X & XI KUL)
  // =========================================================
  {
    id: 'kul-x-1',
    nama: 'X KUL 1',
    jurusan: 'KUL',
    kelas: 'X KUL 1',
    posisi: [-86, 0, 42],
    ukuran: [7.5, 2.8, 6],
    warna: JURUSAN_COLORS.KUL,
    deskripsi: 'Ruang pembelajaran kelas X KUL 1 di deretan selatan-barat.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 31],
      [-86, 0.4, 31],
      [-86, 0.4, 42],
    ],
  },
  {
    id: 'kul-x-2',
    nama: 'X KUL 2',
    jurusan: 'KUL',
    kelas: 'X KUL 2',
    posisi: [-77, 0, 42],
    ukuran: [7.5, 2.8, 6],
    warna: JURUSAN_COLORS.KUL,
    deskripsi: 'Ruang pembelajaran kelas X KUL 2 di deretan selatan-barat.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 31],
      [-77, 0.4, 31],
      [-77, 0.4, 42],
    ],
  },
  {
    id: 'kul-x-3',
    nama: 'X KUL 3',
    jurusan: 'KUL',
    kelas: 'X KUL 3',
    posisi: [-68, 0, 42],
    ukuran: [7.5, 2.8, 6],
    warna: JURUSAN_COLORS.KUL,
    deskripsi: 'Ruang pembelajaran kelas X KUL 3 di deretan selatan-barat.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 31],
      [-68, 0.4, 31],
      [-68, 0.4, 42],
    ],
  },
  {
    id: 'kul-xi-1',
    nama: 'XI KUL 1',
    jurusan: 'KUL',
    kelas: 'XI KUL 1',
    posisi: [-59, 0, 42],
    ukuran: [7.5, 2.8, 6],
    warna: JURUSAN_COLORS.KUL,
    deskripsi: 'Ruang pembelajaran kelas XI KUL 1 di deretan selatan-barat.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 31],
      [-59, 0.4, 31],
      [-59, 0.4, 42],
    ],
  },
  {
    id: 'kul-xi-2',
    nama: 'XI KUL 2',
    jurusan: 'KUL',
    kelas: 'XI KUL 2',
    posisi: [-50, 0, 42],
    ukuran: [7.5, 2.8, 6],
    warna: JURUSAN_COLORS.KUL,
    deskripsi: 'Ruang pembelajaran kelas XI KUL 2 di deretan selatan-barat.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 31],
      [-50, 0.4, 31],
      [-50, 0.4, 42],
    ],
  },
  {
    id: 'kul-xi-3',
    nama: 'XI KUL 3',
    jurusan: 'KUL',
    kelas: 'XI KUL 3',
    posisi: [-41, 0, 42],
    ukuran: [7.5, 2.8, 6],
    warna: JURUSAN_COLORS.KUL,
    deskripsi: 'Ruang pembelajaran kelas XI KUL 3 di deretan selatan-barat.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 31],
      [-41, 0.4, 31],
      [-41, 0.4, 42],
    ],
  },

  // =========================================================
  // LAB. RPL 1 & LAB. RPL 2 (DI ATAS GEDUNG AULA SMKN 2 MOJOKERTO)
  // =========================================================
  {
    id: 'lab-rpl-1',
    nama: 'LAB. RPL 1',
    jurusan: 'RPL',
    kelas: 'Laboratorium RPL',
    posisi: [-23.2, 7.2, 24],
    ukuran: [13, 2.8, 10],
    warna: JURUSAN_COLORS.RPL,
    lantai: 1,
    variant: 'standard',
    deskripsi:
      'Laboratorium Rekayasa Perangkat Lunak. Berada di lantai atas Gedung Aula SMKN 2 Mojokerto.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-23.2, 0.4, 15.5],
      [-23.2, 7.6, 24],
    ],
  },
  {
    id: 'lab-rpl-2',
    nama: 'LAB. RPL 2',
    jurusan: 'RPL',
    kelas: 'Laboratorium RPL',
    posisi: [-8.8, 7.2, 24],
    ukuran: [13, 2.8, 10],
    warna: JURUSAN_COLORS.RPL,
    lantai: 1,
    variant: 'standard',
    deskripsi:
      'Laboratorium Rekayasa Perangkat Lunak. Berada di lantai atas Gedung Aula SMKN 2 Mojokerto.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [-8.8, 0.4, 15.5],
      [-8.8, 7.6, 24],
    ],
  },

  // =========================================================
  // AULA SMKN 2 MOJOKERTO & XII KUL 1-3 (KEMBALI SEJAJAR)
  // =========================================================
  {
    id: 'kul-xii-1',
    nama: 'XII KUL 1',
    jurusan: 'KUL',
    kelas: 'XII KUL 1',
    posisi: [-25, 0, 46],
    ukuran: [7.5, 2.8, 6],
    warna: JURUSAN_COLORS.KUL,
    deskripsi: 'Ruang pembelajaran kelas XII KUL 1 di depan Aula SMKN 2 Mojokerto.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 36.5],
      [-25, 0.4, 36.5],
      [-25, 0.4, 46],
    ],
  },
  {
    id: 'kul-xii-2',
    nama: 'XII KUL 2',
    jurusan: 'KUL',
    kelas: 'XII KUL 2',
    posisi: [-16, 0, 46],
    ukuran: [7.5, 2.8, 6],
    warna: JURUSAN_COLORS.KUL,
    deskripsi: 'Ruang pembelajaran kelas XII KUL 2 di depan Aula SMKN 2 Mojokerto.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 36.5],
      [-16, 0.4, 36.5],
      [-16, 0.4, 46],
    ],
  },
  {
    id: 'kul-xii-3',
    nama: 'XII KUL 3',
    jurusan: 'KUL',
    kelas: 'XII KUL 3',
    posisi: [-7, 0, 46],
    ukuran: [7.5, 2.8, 6],
    warna: JURUSAN_COLORS.KUL,
    deskripsi: 'Ruang pembelajaran kelas XII KUL 3 di depan Aula SMKN 2 Mojokerto.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [-1, 0.4, 36.5],
      [-7, 0.4, 36.5],
      [-7, 0.4, 46],
    ],
  },
  {
    id: 'aula-smkn2',
    nama: 'Aula SMKN 2 Mojokerto',
    jurusan: 'UMUM',
    kelas: 'Aula Serbaguna',
    posisi: [-16, 0, 24],
    ukuran: [28, 7.2, 12],
    warna: JURUSAN_COLORS.UMUM,
    deskripsi: 'Aula utama SMKN 2 Mojokerto untuk pertemuan dan kegiatan besar.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-16, 0.4, 15.5],
      [-16, 0.4, 24],
    ],
  },

  // =========================================================
  // LAB PASTRY, KANTIN, APHP LAB & XI APHP 2-1 DI DEPAN DERETAN LAB
  // =========================================================
  {
    id: 'aphp-xi-2',
    nama: 'XI APHP 2',
    jurusan: 'APHP',
    kelas: 'XI APHP 2',
    posisi: [14, 0, 38],
    ukuran: [8.5, 2.8, 6],
    warna: JURUSAN_COLORS.APHP,
    deskripsi: 'Ruang pembelajaran kelas XI APHP 2 di utara Lab Pastry dan Kantin.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [-1, 0.4, 43],
      [14, 0.4, 43],
      [14, 0.4, 38],
    ],
  },
  {
    id: 'aphp-xi-1',
    nama: 'XI APHP 1',
    jurusan: 'APHP',
    kelas: 'XI APHP 1',
    posisi: [24.3, 0, 38],
    ukuran: [8.5, 2.8, 6],
    warna: JURUSAN_COLORS.APHP,
    deskripsi: 'Ruang pembelajaran kelas XI APHP 1 di utara Kantin dan APHP Lab.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [-1, 0.4, 43],
      [24.3, 0.4, 43],
      [24.3, 0.4, 38],
    ],
  },
  {
    id: 'lab-pastry',
    nama: 'Lab Pastry',
    jurusan: 'KUL',
    kelas: 'Laboratorium Pastry',
    posisi: [12, 0, 49],
    ukuran: [10, 4.6, 7.5],
    warna: JURUSAN_COLORS.KUL,
    deskripsi: 'Laboratorium praktik pastry dan bakery.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [-1, 0.4, 43],
      [12, 0.4, 43],
      [12, 0.4, 49],
    ],
  },
  {
    id: 'kantin',
    nama: 'Kantin',
    jurusan: 'UMUM',
    kelas: 'Kantin Sekolah',
    posisi: [24.3, 0, 49],
    ukuran: [11, 4.6, 7.5],
    warna: JURUSAN_COLORS.UMUM,
    deskripsi: 'Area kantin dan pusat jajanan sehat sekolah.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [-32, 0.4, -37],
      [-32, 0.4, 15.5],
      [-1, 0.4, 15.5],
      [-1, 0.4, 43],
      [24.3, 0.4, 43],
      [24.3, 0.4, 49],
    ],
  },
  {
    id: 'aphp-lab',
    nama: 'APHP Lab',
    jurusan: 'APHP',
    kelas: 'Laboratorium APHP',
    posisi: [36.6, 0, 49],
    ukuran: [10, 4.6, 7.5],
    warna: JURUSAN_COLORS.APHP,
    deskripsi: 'Laboratorium pengolahan hasil pertanian.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, 43],
      [36.6, 0.4, 43],
      [36.6, 0.4, 49],
    ],
  },

  // =========================================================
  // TETA LABORATORY (KANAN BAWAH, GEDUNG KUNING 2 LANTAI)
  // =========================================================
  {
    id: 'teta-laboratory',
    nama: 'TETA Laboratory',
    jurusan: 'UMUM',
    kelas: 'Gedung Laboratorium Terpadu',
    posisi: [68, 0, 34],
    ukuran: [22, 8.4, 13],
    warna: JURUSAN_COLORS.UMUM,
    lantai: 2,
    variant: 'two_story',
    zona: 'TETA Laboratory (Akses Terbatas)',
    akses: 'privat',
    deskripsi: 'Gedung TETA Laboratory dua lantai berwarna kuning di sisi tenggara.',
    rute: [
      [0, 0.4, -52.5],
      [0, 0.4, -37],
      [43.5, 0.4, -37],
      [43.5, 0.4, 31],
      [68, 0.4, 31],
      [68, 0.4, 34],
    ],
  },
];
