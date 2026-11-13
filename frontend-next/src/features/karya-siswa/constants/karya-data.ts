import {
  BookOpen,
  CakeSlice,
  Camera,
  ChefHat,
  Coins,
  HeartHandshake,
  Leaf,
  Megaphone,
  Package,
  Palette,
  PenTool,
  PiggyBank,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Data karya siswa untuk halaman /karya-siswa dan ajakan di beranda.
 *
 * CATATAN: hanya cekrek! (RPL) yang karya asli. Karya jurusan lain beserta nama siswanya adalah
 * CONTOH yang disamakan dengan cerita PKL di beranda. Ganti dengan karya asli (dan izin siswa)
 * sebelum dipublikasikan.
 * Foto: public/images/karya/, rasio 4:3 (mis. 1456×1088), format WebP. Jika file belum ada,
 * kartu menampilkan latar jurusan sebagai pengganti.
 * Karya aplikasi memakai dua tangkapan layar: desktop 16:10 (mis. 1440×900) dan ponsel (mis. 390×844).
 */

export const KARYA_JURUSAN = {
  rpl: "RPL",
  dkv: "DKV",
  boga: "Kuliner",
  aphp: "APHP",
  lps: "Perbankan Syariah",
} as const;

export type KaryaJurusan = keyof typeof KARYA_JURUSAN;

export interface KaryaHighlight {
  icon: LucideIcon;
  title: string;
  text: string;
}

export type KaryaMedia =
  | { tipe: "aplikasi"; desktop: string; ponsel: string; alt: string }
  | { tipe: "foto"; src: string; alt: string };

export interface KaryaSiswa {
  slug: string;
  nama: string;
  jurusan: KaryaJurusan;
  kategori: string;
  tagline: string;
  deskripsi: string;
  url?: string;
  highlights: KaryaHighlight[];
  pembuat: { nama: string; kelas: string; foto?: string; asal: string; cerita: string };
  media: KaryaMedia;
}

export const KARYA_SISWA: KaryaSiswa[] = [
  {
    slug: "cekrek",
    nama: "cekrek!",
    jurusan: "rpl",
    kategori: "Aplikasi Web",
    tagline: "Photobooth di sakumu.",
    deskripsi:
      "Photobooth online yang berjalan langsung di browser. Pilih frame kekinian, berpose mengikuti hitungan mundur, hias hasilnya dengan stiker dan filter, lalu unduh sebagai strip foto, GIF, atau lembar cetak 4×6.",
    url: "https://www.rafiz.my.id/",
    highlights: [
      { icon: Camera, title: "Frame tren & frame musik", text: "Gaya koran, film, Y2K, hingga Now Playing." },
      { icon: HeartHandshake, title: "Bilik Foto LDR", text: "Foto bareng secara live dari kota berbeda." },
      { icon: ShieldCheck, title: "Privasi terjaga", text: "Foto diproses di perangkat, tidak disimpan di server." },
      { icon: Smartphone, title: "Bisa dipasang", text: "Jalan di HP dan laptop, bahkan tanpa internet." },
    ],
    pembuat: {
      nama: "Rafi Zaki",
      kelas: "XII RPL 2",
      foto: "/images/lulusan/rafi-zaki.webp",
      asal: "Hasil PKL 6 bulan",
      cerita:
        "Enam bulan PKL membuat saya merasakan langsung ritme kerja di industri perangkat lunak: memahami kebutuhan pengguna, menulis kode yang rapi, menguji, hingga merilis aplikasi. Cekrek! adalah bukti bahwa ilmu itu bisa saya wujudkan sendiri, dari sekadar ide sampai aplikasi yang bisa dicoba siapa saja.",
    },
    media: {
      tipe: "aplikasi",
      desktop: "/images/karya/cekrek-desktop.webp",
      ponsel: "/images/karya/cekrek-mobile.webp",
      alt: "Tampilan aplikasi photobooth cekrek! di laptop dan ponsel",
    },
  },
  {
    slug: "rupa-baru-onde-onde",
    nama: "Rupa Baru Onde-Onde",
    jurusan: "dkv",
    kategori: "Identitas Visual",
    tagline: "Wajah baru untuk camilan legendaris.",
    deskripsi:
      "Proyek rebranding untuk UMKM onde-onde khas Mojokerto: logo baru, kemasan kotak kraft, stiker segel, kartu nama, hingga poster promosi. Ilustrasinya mengangkat siluet pendopo agar camilan ini tampil bangga dengan akar daerahnya.",
    highlights: [
      { icon: Palette, title: "Palet warna hangat", text: "Kuning keemasan dan biru tua yang mudah diingat." },
      { icon: PenTool, title: "Ilustrasi pendopo", text: "Mengangkat arsitektur khas Mojokerto." },
      { icon: Package, title: "Kemasan kraft", text: "Ramah lingkungan dan mudah dicetak." },
      { icon: Megaphone, title: "Paket promosi", text: "Poster, stiker, dan kartu nama siap pakai." },
    ],
    pembuat: {
      nama: "Nadia Kusuma",
      kelas: "XII DKV 1",
      asal: "Hasil PKL 6 bulan",
      cerita:
        "Di tempat PKL saya belajar bahwa desain harus menjawab masalah klien, bukan sekadar terlihat cantik. Bekal itu saya bawa pulang untuk membantu UMKM di kota sendiri tampil lebih percaya diri.",
    },
    media: {
      tipe: "foto",
      src: "/images/karya/rupa-baru-onde-onde.webp",
      alt: "Kemasan kotak kraft, poster, stiker, dan kartu nama hasil rebranding onde-onde",
    },
  },
  {
    slug: "klepon-mousse-cake",
    nama: "Klepon Mousse Cake",
    jurusan: "boga",
    kategori: "Pastry & Dessert",
    tagline: "Rasa jajanan pasar, tampilan fine dining.",
    deskripsi:
      "Dessert modern yang menerjemahkan klepon ke piring restoran: mousse pandan lembut berlapis glaze gula merah, taburan kelapa sangrai, dan sesendok es krim kelapa. Rasa yang akrab, disajikan dengan teknik plating profesional.",
    highlights: [
      { icon: Leaf, title: "Pandan asli", text: "Warna dan aroma dari daun pandan segar." },
      { icon: CakeSlice, title: "Teknik mousse", text: "Tekstur ringan dan lembut di setiap suapan." },
      { icon: ChefHat, title: "Plating restoran", text: "Ditata mengikuti standar dapur profesional." },
      { icon: Sparkles, title: "Cita rasa lokal", text: "Gula merah dan kelapa khas jajanan pasar." },
    ],
    pembuat: {
      nama: "Salsabila Rahma",
      kelas: "XII Kuliner 1",
      asal: "Hasil PKL 6 bulan",
      cerita:
        "Ritme dapur restoran saat PKL mengajari saya disiplin dan teliti sampai ke detail terkecil. Dari situ saya ingin membuktikan bahwa jajanan pasar pun bisa naik kelas tanpa kehilangan rasa aslinya.",
    },
    media: {
      tipe: "foto",
      src: "/images/karya/klepon-mousse-cake.webp",
      alt: "Mousse pandan berlapis glaze gula merah dan kelapa sangrai dengan es krim kelapa",
    },
  },
  {
    slug: "kriuk-tiram",
    nama: "Kriuk Tiram",
    jurusan: "aphp",
    kategori: "Olahan Pangan",
    tagline: "Camilan renyah dari jamur tiram lokal.",
    deskripsi:
      "Keripik jamur tiram yang diolah dari hasil panen petani sekitar Mojokerto. Jamur disortir dan diolah secara higienis, digoreng hingga renyah, lalu dikemas dalam standing pouch kraft berjendela agar isinya terlihat jelas.",
    highlights: [
      { icon: Sprout, title: "Bahan baku lokal", text: "Jamur tiram dari petani sekitar." },
      { icon: ShieldCheck, title: "Mutu terkontrol", text: "Proses higienis dari sortir hingga kemas." },
      { icon: Package, title: "Kemasan kekinian", text: "Standing pouch kraft dengan jendela." },
      { icon: Store, title: "Siap dipasarkan", text: "Cocok untuk oleh-oleh dan titip jual." },
    ],
    pembuat: {
      nama: "Dewi Anggraini",
      kelas: "XII APHP 1",
      asal: "Hasil PKL 6 bulan",
      cerita:
        "Di pabrik olahan saya belajar bahwa satu tahap kecil bisa menentukan mutu produk. Ilmu itu saya pakai untuk mengubah jamur tiram dari petani sekitar menjadi camilan yang layak bersaing di rak toko.",
    },
    media: {
      tipe: "foto",
      src: "/images/karya/kriuk-tiram.webp",
      alt: "Keripik jamur tiram dalam kemasan pouch kraft berjendela di atas meja kayu",
    },
  },
  {
    slug: "saku-syariah",
    nama: "Saku Syariah",
    jurusan: "lps",
    kategori: "Media Edukasi",
    tagline: "Belajar keuangan syariah semudah main kartu.",
    deskripsi:
      "Paket literasi keuangan untuk pelajar: buku saku bergambar dan kartu edukasi yang menjelaskan cara menabung, akad wadiah dan mudharabah, hingga beda bunga dan bagi hasil. Dilengkapi celengan untuk langsung mempraktikkan kebiasaan menabung.",
    highlights: [
      { icon: BookOpen, title: "Buku saku bergambar", text: "Materi padat dalam bahasa yang ringan." },
      { icon: Coins, title: "Kartu akad", text: "Wadiah, mudharabah, dan murabahah dalam ilustrasi." },
      { icon: PiggyBank, title: "Celengan praktik", text: "Menabung langsung, bukan sekadar teori." },
      { icon: Users, title: "Cocok untuk sosialisasi", text: "Dirancang untuk siswa SMP dan SMA." },
    ],
    pembuat: {
      nama: "Rizky Ramadhan",
      kelas: "XII LPS 1",
      asal: "Hasil PKL 6 bulan",
      cerita:
        "Melayani nasabah selama PKL membuat saya sadar masih banyak orang yang belum paham produk bank syariah. Saku Syariah saya buat agar adik-adik bisa mengenalnya lebih awal, dengan cara yang menyenangkan.",
    },
    media: {
      tipe: "foto",
      src: "/images/karya/saku-syariah.webp",
      alt: "Buku saku dan kartu edukasi keuangan syariah dengan celengan koin di meja teller",
    },
  },
];

export const getKarya = (slug: string) => KARYA_SISWA.find((karya) => karya.slug === slug);
