export const BKK_KATEGORI = ["Perbankan", "IT & Teknologi", "Kuliner & Hospitality", "Desain & Kreatif", "Manufaktur"];

export const BKK_CONTACT = {
  telepon: "(0321) 387-356",
  whatsapp: "0812-3456-7890",
  email: "bkk.smkn2mr@gmail.com",
};

// banner = kepala kartu berwarna di daftar lowongan; poster = gambar asli bila ada
export const LOWONGAN = [
  {
    slug: "desainer-grafis",
    title: "Desainer Grafis",
    company: "PT Kita Lewati Sendiri",
    location: "Malang",
    kategori: "Desain & Kreatif",
    tipe: "Full-time",
    tutup: "30 Sep 2026",
    status: "Aktif",
    poster: "/images/bkk/loker-1.jpg",
    banner: { bg: "#e8890b", headline: "Dibutuhkan Segera!", sub: "Desainer Grafis" },
    deskripsi:
      "Kami mencari Desainer Grafis yang kreatif dan memiliki perhatian terhadap detail untuk membantu menghasilkan berbagai kebutuhan visual perusahaan, mulai dari konten digital, materi promosi, hingga kebutuhan desain lainnya.",
    tanggungJawab: [
      "Membuat desain untuk kebutuhan media sosial dan promosi perusahaan",
      "Mengembangkan konsep visual sesuai dengan identitas brand",
      "Melakukan revisi desain berdasarkan kebutuhan dan masukan tim",
      "Berkolaborasi dengan tim untuk menghasilkan desain yang menarik dan komunikatif",
    ],
    kualifikasi: [
      "Lulusan SMK/SMA atau sederajat, khususnya bidang Desain Grafis/DKV menjadi nilai tambah",
      "Menguasai aplikasi desain seperti Adobe Photoshop, Illustrator, CorelDRAW, atau Canva",
      "Mampu bekerja secara mandiri maupun dalam tim",
      "Memiliki portofolio desain menjadi nilai tambah",
    ],
  },
  {
    slug: "staff-it-support",
    title: "Staff IT Support",
    company: "PT Kita Lewati Berdua",
    location: "Mojokerto",
    kategori: "IT & Teknologi",
    tipe: "Full-time",
    tutup: "25 Sep 2026",
    status: "Aktif",
    poster: "/images/bkk/poster-staff-it.jpg",
    banner: { bg: "#0c7870", headline: "Staff IT", sub: "PT Kita Lewati Berdua" },
    deskripsi:
      "Kami mencari Staff IT Support yang akan bertanggung jawab menjaga kelancaran sistem jaringan dan perangkat kantor, menangani troubleshooting harian, serta mendukung tim IT dalam proyek pengembangan infrastruktur perusahaan.",
    tanggungJawab: [
      "Memelihara dan memperbaiki jaringan serta perangkat kantor",
      "Menangani keluhan teknis dari pengguna internal",
      "Melakukan instalasi dan konfigurasi perangkat keras/lunak",
      "Mendokumentasikan setiap tiket dan solusi yang diberikan",
    ],
    kualifikasi: [
      "Lulusan SMK jurusan Rekayasa Perangkat Lunak/TKJ",
      "Familiar dengan OS Windows, Linux, dan jaringan dasar (LAN/WAN)",
      "Fresh graduate dipersilakan melamar",
      "Jujur, teliti, dan mampu bekerja dalam tim",
    ],
  },
  {
    slug: "lomba-inovasi-produk-olahan-pangan",
    title: "Lomba Inovasi Produk Olahan Pangan",
    company: "Tim Siswa APHP",
    location: "Mojokerto",
    kategori: "Kuliner & Hospitality",
    tipe: "Part-time",
    tutup: "30 Sep 2026",
    status: "Aktif",
    poster: "/images/bkk/loker-3.jpg",
    banner: { bg: "#5b4021", headline: "Lowongan Pekerjaan", sub: "Barista · Waiters" },
    deskripsi:
      "Dibutuhkan barista dan waiters untuk mendukung operasional kafe mitra BKK. Cocok untuk lulusan yang ingin mengasah keterampilan pelayanan dan pengolahan minuman.",
    tanggungJawab: [
      "Menyiapkan dan menyajikan minuman sesuai standar resep",
      "Melayani tamu dengan ramah dan cekatan",
      "Menjaga kebersihan area kerja dan peralatan",
    ],
    kualifikasi: [
      "Lulusan SMK jurusan Kuliner/APHP atau sederajat",
      "Berpenampilan rapi dan komunikatif",
      "Bersedia bekerja dengan sistem shift",
    ],
  },
  {
    slug: "frontliner-bank",
    title: "Frontliner Bank",
    company: "Bank Syariah Indonesia",
    location: "Surabaya",
    kategori: "Perbankan",
    tipe: "Full-time",
    tutup: "5 Okt 2026",
    status: "Aktif",
    poster: null,
    banner: { bg: "#1d52c7", headline: "Frontliner Bank", sub: "Bank Syariah Indonesia" },
    deskripsi:
      "Bank Syariah Indonesia membuka kesempatan bagi lulusan untuk bergabung sebagai frontliner (teller dan customer service) yang memberikan layanan prima kepada nasabah.",
    tanggungJawab: [
      "Melayani transaksi tunai dan non-tunai nasabah",
      "Memberikan informasi produk perbankan syariah",
      "Menjaga ketepatan dan kerapian administrasi transaksi",
    ],
    kualifikasi: [
      "Lulusan SMK jurusan Layanan Perbankan Syariah/Akuntansi",
      "Berpenampilan menarik dan komunikatif",
      "Teliti, jujur, dan berorientasi pelayanan",
    ],
  },
  {
    slug: "cook-helper",
    title: "Cook Helper",
    company: "Hotel Aston Mojokerto",
    location: "Mojokerto",
    kategori: "Kuliner & Hospitality",
    tipe: "Full-time",
    tutup: "10 Okt 2026",
    status: "Aktif",
    poster: null,
    banner: { bg: "#b22321", headline: "Cook Helper", sub: "Hotel Aston Mojokerto" },
    deskripsi:
      "Hotel Aston Mojokerto mencari Cook Helper untuk membantu operasional dapur hotel, mulai dari persiapan bahan hingga penyajian menu.",
    tanggungJawab: [
      "Menyiapkan bahan makanan sesuai standar dapur",
      "Membantu chef dalam proses memasak dan plating",
      "Menjaga kebersihan dan sanitasi area dapur",
    ],
    kualifikasi: [
      "Lulusan SMK jurusan Kuliner/Tata Boga",
      "Memahami standar higiene dan sanitasi makanan",
      "Bersedia bekerja dengan sistem shift",
    ],
  },
  {
    slug: "operator-produksi",
    title: "Operator Produksi",
    company: "PT Indomobil Griya",
    location: "Mojokerto",
    kategori: "Manufaktur",
    tipe: "Full-time",
    tutup: "12 Okt 2026",
    status: "Aktif",
    poster: null,
    banner: { bg: "#4e369f", headline: "Operator Produksi", sub: "PT Indomobil Griya" },
    deskripsi:
      "PT Indomobil Griya membuka lowongan Operator Produksi untuk mendukung proses produksi yang aman, efisien, dan sesuai standar mutu perusahaan.",
    tanggungJawab: [
      "Mengoperasikan mesin produksi sesuai SOP",
      "Melakukan pengecekan kualitas hasil produksi",
      "Melaporkan kendala produksi kepada supervisor",
    ],
    kualifikasi: [
      "Lulusan SMK semua jurusan",
      "Sehat jasmani dan rohani",
      "Bersedia bekerja dengan sistem shift",
    ],
  },
];

export const getLowongan = (slug) => LOWONGAN.find((item) => item.slug === slug) ?? null;

export const BKK_REKRUT = [
  { nama: "Deswita Amanda N.", kelas: "XII RPL 1", perusahaan: "PT Pixel Studio Indonesia", foto: "/images/bkk/rekrut-1.jpg" },
  { nama: "Muhammad Daffa D.", kelas: "XII RPL 1", perusahaan: "PT Pixel Studio Indonesia", foto: "/images/bkk/rekrut-2.jpg" },
  { nama: "Jihan Salma R.S", kelas: "XII RPL 2", perusahaan: "PT Laskar Buah Indonesia", foto: "/images/bkk/rekrut-3.jpg" },
  { nama: "Aditya Wahyu H.", kelas: "XII RPL 3", perusahaan: "PT Topsel Raharja Indonesia", foto: "/images/bkk/rekrut-4.jpg" },
];

export const BKK_MITRA = [
  "PT. Indomobil Griya",
  "PT. Cokeniat Kawan",
  "PT. Kartikaart",
  "PT. Hasana Teknologi Indonesia",
  "MikroTik Tech",
  "Top Sol",
];

export const BKK_VISI =
  "Menjadi pusat layanan ketenagakerjaan yang profesional, terpercaya, dan berdaya saing global dalam menjembatani lulusan dengan dunia industri.";

export const BKK_MISI = [
  "Menyediakan informasi lowongan kerja yang terkini dan sesuai kompetensi siswa.",
  "Menjalin kerja sama berkelanjutan dengan dunia usaha dan dunia industri.",
  "Meningkatkan daya saing lulusan sesuai kebutuhan kerja modern.",
  "Memberikan layanan penyaluran kerja yang transparan dan profesional.",
];
