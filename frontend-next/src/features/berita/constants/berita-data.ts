export interface BeritaStaticItem {
  slug: string;
  category: string;
  title: string;
  date: string;
  thumb?: string;
  gradient: string;
}

export interface BeritaStaticDetail extends BeritaStaticItem {
  author: string;
  hero: string | null;
  paragraphs: string[];
  gallery: string[];
}

export const BERITA_KATEGORI: string[] = ["Informasi umum", "Prestasi", "Agenda sekolah", "Pengumuman", "Karya siswa"];

// Warna lencana kategori di daftar berita
export const KATEGORI_TONES: Record<string, string> = {
  Prestasi: "bg-[#fef9c3] text-[#a16207] dark:bg-yellow-400/15 dark:text-yellow-200",
  "Agenda sekolah": "bg-[#e0e7ff] text-[#4338ca] dark:bg-indigo-400/15 dark:text-indigo-200",
  "Informasi umum": "bg-[#dcfce7] text-[#15803d] dark:bg-green-400/15 dark:text-green-200",
  Pengumuman: "bg-[#ffedd5] text-[#c2410c] dark:bg-orange-400/15 dark:text-orange-200",
  "Karya siswa": "bg-[#fef9c3] text-[#a16207] dark:bg-yellow-400/15 dark:text-yellow-200",
};

// Teks dan foto diambil dari media sumber; urut dari yang terbaru
const BERITA_DETAIL: BeritaStaticDetail[] = [
  {
    slug: "police-goes-to-school-motivasi-pelajar-smk-mojokerto-siap-hadapi-dunia-kerja",
    category: "Agenda sekolah",
    title: "Police Goes to School Motivasi Pelajar SMK Mojokerto Siap Hadapi Dunia Kerja",
    date: "24 Agustus 2026",
    thumb: "/images/news/police-goes-to-school.webp",
    gradient: "from-[#3b82f6] to-[#1e40af]",
    author: "detikJatim",
    hero: "/images/news/police-goes-to-school.webp",
    paragraphs: [
      "Kapolres Mojokerto Kota, AKBP Herdiawan Arifianto, menyapa langsung ratusan siswa SMK melalui program police goes to school. Kali ini, ia memotivasi para pelajar agar menyiapkan diri untuk menghadapi dunia kerja.",
      "Police goes to school kali ini menyasar SMKN 2 Kota Mojokerto di Kelurahan Pulorejo. Herdiawan menjadi inspektur upacara di sekolah menengah kejuruan ini untuk menyampaikan langsung sejumlah wejangan kepada ratusan pelajar.",
      "Sebab upacara ini diikuti sedikitnya 900 siswa, para guru dan staf SMKN 2 Kota Mojokerto. Tak sendirian, Herdiawan juga didampingi Kapolsek Prajurit Kulon Kompol Purnomo, Kasat Binmas AKP Hermanto, serta Bhabinkamtibmas Pulorejo Brigadir Bagas.",
      "Berbeda dengan materi sebelumnya terkait mencegah kenakalan remaja, edukasi bahaya penyalahgunaan narkoba hingga perundungan, dalam police goes to school kali ini, Herdiawan lebih banyak memotivasi para pelajar untuk meraih cita-cita masing-masing.",
      "Kapolres Mojokerto Kota ini mengajak para siswa menyiapkan diri menghadapi masa depan dengan mengasah keterampilan dan pengetahuan. Sehingga ketika lulus dari SMK, nantinya mereka mampu bersaing di dunia kerja.",
      "\"Adik-adik pelajar SMK kami ajak menyiapkan diri untuk mencapai cita-cita. Supaya ketika lulus dari SMKN 2 Kota Mojokerto tidak sia-sia karena mereka sudah memiliki pengetahuan dan keterampilan,\" terang Herdiawan di lokasi, Senin (24/8/2026).",
      "Tidak hanya itu, Herdiawan juga membangun kesadaran para pelajar SMKN 2 Kota Mojokerto agar mempunyai tujuan setelah lulus sekolah. Sehingga aktivitas mereka sehari-hari tidak mengalir begitu saja tanpa arah.",
      "Ia lantas mewanti-wanti agar para pelajar senantiasa hormat dan taat kepada guru dan orang tua. Sebab peran guru dan orang tua sangat besar untuk mencapai kesuksesan. Kemudian memanfaatkan medsos tak sekadar hiburan, tapi juga untuk menambah pengetahuan dan keterampilan.",
      "\"Adik-adik pelajar juga harus mendengarkan nasihat bapak dan ibu guru, juga orang tua. Karena guru dan orang tua yang membantu mewujudkan cita-cita dan keinginan mereka,\" jelasnya.",
      "Police goes to school menuai apresiasi dari para guru SMKN 2 Kota Mojokerto. Program ini wujud sinergi Polri dengan lembaga pendidikan sebagai sarana edukasi, motivasi, serta membangun kesadaran generasi muda agar menjadi pelajar yang berprestasi, bertanggungjawab dan mampu memberikan kontribusi positif bagi masyarakat, bangsa dan negara.",
      "\"Terima kasih Kapolres Mojokerto Kota yang telah memberikan motivasi kepada siswa-siswi SMKN 2 Kota Mojokerto. Semoga sinergi kepolisian dan sekolah dapat membawa perkembangan dan kemajuan bagi dunia pendidikan Indonesia,\" tandas Guru SMKN 2 Kota Mojokerto, Arika.",
      "Sumber: detik.com, https://www.detik.com/jatim/jogo-jatim/d-8633223/police-goes-to-school-motivasi-pelajar-smk-mojokerto-siap-hadapi-dunia-kerja",
    ],
    gallery: [],
  },
  {
    slug: "siswa-baru-smkn-2-mojokerto-digembleng-5-hari-jadi-generasi-hebat-anti-korupsi-siap-kerja",
    category: "Agenda sekolah",
    title: "Bukan Sekadar Kenalan! Siswa Baru SMKN 2 Kota Mojokerto Digembleng 5 Hari Jadi Generasi Hebat, Anti Korupsi, Siap Kerja",
    date: "13 Juli 2026",
    thumb: "/images/news/mpls-2026.webp",
    gradient: "from-[#3b82f6] to-[#1e40af]",
    author: "majalahglobal.com",
    hero: "/images/news/mpls-2026.webp",
    paragraphs: [
      "Gerbang SMKN 2 Mojokerto kembali terbuka. Senin (13/7/2026), 400 lebih siswa baru angkatan 2026/2027 resmi memulai perjalanan mereka.",
      "Tapi ini bukan MPLS biasa. Selama 5 hari ke depan, mereka akan ditempa dengan 3 kata kunci: karakter, kompetensi, dan kebersamaan.",
      "\"Kami ingin siswa baru tidak hanya mengenal sekolah, tetapi juga memahami nilai kejujuran, disiplin, dan semangat belajar,\" tegas Kepala SMKN 2 Mojokerto, Iswahyudi.",
      "Hari Pertama: Dari Salam Sapa hingga Kampanye Antikorupsi",
      "Hari pertama dibuka dengan \"Salam Sapa Murid Baru\" yang penuh semangat. Pembukaan MPLS sendiri dipusatkan di SMKN 2 Singosari Malang dan diikuti secara daring oleh seluruh SMK di Jawa Timur.",
      "Usai pembukaan, siswa langsung masuk materi inti. Ada kampanye antikorupsi, materi \"Aku dan Sekolahku\", Gerakan 7 Kebiasaan Anak Indonesia Hebat, hingga Wawasan Wiyata Mandala.",
      "Tujuannya jelas: menanamkan integritas sejak hari pertama masuk sekolah vokasi.",
      "Hari 2-5: Cek Kesehatan, Asesmen, hingga Alumni Berbagi",
      "Memasuki hari kedua, ritme MPLS makin padat. Siswa mengikuti \"Pertemuan Pagi Ceria\", cek kesehatan, asesmen literasi dan numerasi.",
      "Yang menarik, ada sesi \"Pengenalan Konsentrasi Keahlian\" dan \"Alumni Berbagi\". Di sini para alumni dan guru produktif turun langsung bercerita tentang dunia kerja dan industri.",
      "\"Alumni dan guru produktif kami libatkan agar siswa lebih cepat memahami arah jurusan yang mereka pilih,\" jelas Iswahyudi.",
      "Pencegahan masalah remaja juga jadi fokus. Siswa dibekali penyuluhan dampak negatif kecanduan game online.",
      "Puncak: Unjuk Karya dan Budaya",
      "Memasuki hari keempat, suasana berubah. Aula sekolah jadi panggung kreativitas. Siswa menampilkan unjuk karya dan pengenalan ekstrakurikuler. Setiap jurusan menunjukkan keahliannya langsung.",
      "Puncaknya Jumat (17/7/2026). MPLS ditutup dengan kegiatan budaya, refleksi, dan penutupan resmi.",
      "Iswahyudi berharap, 5 hari ini menjadi fondasi kuat.",
      "\"MPLS ini adalah fondasi. Dari sini kami tanamkan budaya kerja, kolaborasi, dan kebanggaan menjadi keluarga besar SMKN 2 Mojokerto,\" tandasnya.",
      "Dengan konsep ini, SMKN 2 Mojokerto ingin melahirkan lulusan yang tidak hanya punya ijazah. Tapi lulusan yang hebat, berakhlak, dan siap bersaing di dunia industri. (Jay/Adv)",
      "Sumber: majalahglobal.com, https://majalahglobal.com/2026/07/13/bukan-sekadar-kenalan-siswa-baru-smkn-2-kota-mojokerto-digembleng-5-hari-jadi-generasi-hebat-anti-korupsi-siap-kerja/",
    ],
    gallery: [],
  },
  {
    slug: "kpu-kota-mojokerto-terima-empat-siswa-pkl-dari-smkn-2-kota-mojokerto",
    category: "Informasi umum",
    title: "KPU Kota Mojokerto Terima Empat Siswa PKL dari SMKN 2 Kota Mojokerto",
    date: "6 April 2026",
    thumb: "/images/news/pkl-kpu.webp",
    gradient: "from-[#4caf50] to-[#2e7d32]",
    author: "KPU Kota Mojokerto",
    hero: "/images/news/pkl-kpu.webp",
    paragraphs: [
      "Komisi Pemilihan Umum (KPU) Kota Mojokerto secara resmi menerima empat siswa dari SMK Negeri 2 Kota Mojokerto untuk melaksanakan Praktik Kerja Lapangan (PKL). Keempat siswa tersebut, yakni Keylovelica Aqmaela Restuandyta, Revani Khoirunnisa', Riswanda Aura Ramadhana, dan Verlita Azakiza Mulyono, akan menjalani Praktik Kerja Lapangan (PKL) selama tujuh bulan mulai April hingga Oktober 2026.",
      "Selama masa PKL, para siswa akan dilibatkan langsung dalam berbagai agenda kerja KPU, mereka juga diharapkan dapat membantu proses sosialisasi kegiatan KPU guna meningkatkan pemahaman masyarakat terkait tahapan pemilu.",
      "Sekretaris KPU Kota Mojokerto, Wiratmoko Iman Santoso, dalam sambutannya menekankan pentingnya bagi para siswa mengenai tata kerja lembaga negara. Beliau berharap para siswa dapat mengedepankan nilai integritas dan profesionalitas selama bertugas di lingkungan KPU Kota Mojokerto.",
      "Sementara itu, pihak SMK Negeri 2 Kota Mojokerto yang diwakili oleh Ibu Supriati, S.Kom, menyampaikan terima kasih atas kesempatan yang diberikan bagi siswanya. Melalui kerja sama ini, diharapkan para siswa mendapatkan pengalaman dunia kerja yang nyata dan kompetensi mereka di bidangnya semakin terasah. (hai)",
      "Sumber: kota-mojokerto.kpu.go.id, https://kota-mojokerto.kpu.go.id/blog/read/8971_kpu-kota-mojokerto-terima-empat-siswa-pkl-dari-smkn-2-kota-mojokerto",
    ],
    gallery: [],
  },
  {
    slug: "hut-kabar-terdepan-siswa-kuliner-smkn-2-kota-mojokerto-unjuk-kualitas",
    category: "Karya siswa",
    title: "HUT ke-2 Kabar Terdepan, Siswa Kuliner SMKN 2 Kota Mojokerto Unjuk Kualitas",
    date: "28 Juni 2025",
    thumb: "/images/news/hut-kabar-terdepan.webp",
    gradient: "from-[#e5c100] to-[#b38f00]",
    author: "Kabar Terdepan",
    hero: "/images/news/hut-kabar-terdepan.webp",
    paragraphs: [
      "Peringatan Hari Ulang Tahun (HUT) ke-2 Kabar Terdepan menjadi momen spesial bagi siswa-siswi SMKN 2 Kota Mojokerto.",
      "Mereka termasuk bagian dari tim casual atau pelayanan acara. Mereka menunjukkan kualitas dan kerja sama dalam menyukseskan kegiatan yang digelar di Royal Regency Hall, Kota Mojokerto, Senin (23/06/2025).",
      "Sebanyak 8 siswa terpilih mendapatkan tanggung jawab langsung dari guru pendamping. Mereka bertugas dalam dua bagian penting, yaitu penyajian makanan di meja prasmanan dan pelayanan kepada para tamu undangan.",
      "\"Kita sudah koordinasi dari awal, termasuk soal menu, acara, dan penataan meja. 8 siswa SMKN 2 Kota Mojokerto dilibatkan agar mereka tahu alur dari persiapan sampai akhir acara,\" ujar Sri, guru kuliner SMKN 2 Kota Mojokerto, Sabtu (28/06/2025).",
      "Siswa-siswi dibagi dalam beberapa kelompok sesuai peran masing-masing. Setiap kelompok bertanggung jawab menjaga area prasmanan agar tetap bersih, tertata, dan makanan selalu tersedia dalam jumlah cukup.",
      "Sebagian siswa yang terlibat adalah peserta baru, namun ada pula yang sudah sering menjadi casual crew di acara sebelumnya. Dalam pelaksanaan, terjadi proses transfer ilmu dari yang berpengalaman kepada siswa yang baru pertama kali bergabung.",
      "Siswa kelas 10 jurusan kuliner dipercaya untuk memimpin bidang makanan dan pelayanan. Ini menjadi bagian dari pembelajaran praktik langsung dalam dunia kerja, sekaligus menjaga mutu pelayanan.",
      "\"Saya tugaskan dua orang khusus. Satu orang memantau kebersihan meja dan menambah makanan bila kurang, sedangkan satu lagi bertanggung jawab penuh terhadap coffee break,\" kata Sri.",
      "Tim coffee break diberikan tugas penting, yakni menghitung jumlah makanan dan minuman per porsi. Tugas ini sangat vital agar tidak terjadi kekurangan fatal saat jam makan atau menjelang acara dimulai.",
      "Sri menekankan pentingnya pelayanan maksimal dalam setiap kesempatan. Semua detail harus diperhatikan, mulai dari ketersediaan makanan hingga sikap siswa dalam melayani tamu.",
      "\"Siapapun yang memakai jasa siswa SMKN 2 harus kita berikan yang terbaik. Kita harus pastikan makanan tertata dengan baik dan pelayanan maksimal,\" tegas Sri.",
      "Innka, selaku Tim Media Kabar Terdepan, memberikan apresiasi tinggi kepada siswa-siswi kuliner SMKN 2 Kota Mojokerto yang telah melaksanakan tugas secara profesional.",
      "\"Puji Tuhan, acara berjalan lancar. Anak-anak SMKN 2 Kota Mojokerto menjalankan tugasnya dengan sangat baik, dan kami puas memakai jasa casual mereka,\" ujar Innka.",
      "Perayaan ini bukan hanya tentang acara, tetapi juga menjadi ajang pembuktian kemampuan siswa dalam menghadapi tantangan nyata. Semangat kerja sama dan profesionalisme menjadi kunci suksesnya kegiatan HUT Kabar Terdepan. (Innka Cristy Natalia)",
      "Sumber: kabarterdepan.com, https://kabarterdepan.com/hut-kabar-terdepan-siswa-smkn-2-kota-mojokerto/",
    ],
    gallery: [],
  },
  {
    slug: "puluhan-siswa-smk-negeri-2-kota-mojokerto-lolos-ptn-lewat-jalur-snbp",
    category: "Prestasi",
    title: "Puluhan Siswa SMK Negeri 2 Kota Mojokerto Lolos PTN lewat Jalur SNBP",
    date: "17 April 2026",
    thumb: "/images/news/lolos-ptn-snbp.webp",
    gradient: "from-[#0284c7] to-[#0c4a6e]",
    author: "Radar Mojokerto",
    hero: "/images/news/lolos-ptn-snbp.webp",
    paragraphs: [
      "Prestasi akademik membanggakan kembali diukir oleh SMK Negeri 2 Kota Mojokerto. Sebanyak 21 siswa kelas XII berhasil dinyatakan lolos masuk Perguruan Tinggi Negeri (PTN) terkemuka di Indonesia melalui jalur Seleksi Nasional Berdasarkan Prestasi (SNBP).",
      "Capaian kelulusan jalur prestasi tahun ini menunjukkan tren peningkatan yang konsisten dibandingkan tahun-tahun sebelumnya, di mana pada tahun sebelumnya tercatat 14 siswa dan 11 siswa yang lolos melalui jalur tanpa tes tersebut. Hal ini membuktikan bahwa lulusan SMK tidak hanya siap terjun langsung ke dunia industri, tetapi juga memiliki daya saing akademik yang unggul untuk melanjutkan pendidikan tinggi.",
      "Puluhan siswa SMKN 2 Kota Mojokerto yang lolos SNBP tersebut tersebar di berbagai PTN favorit, mulai dari Institut Teknologi Sepuluh Nopember (ITS), Universitas Airlangga (Unair), Universitas Brawijaya (UB), Universitas Negeri Surabaya (Unesa), UPN Veteran Jawa Timur, Universitas Trunojoyo Madura (UTM), hingga politeknik dan institut seni negeri seperti PENS, Polinema, Polije, Poliwangi, ISI Yogyakarta, dan ISI Surakarta.",
      "Kepala SMKN 2 Kota Mojokerto, Drs. H. Iswahyudi, M.Pd., menyampaikan apresiasi dan rasa syukur atas keberhasilan para siswa serta kerja keras tim guru Bimbingan Konseling (BK) dan wali kelas yang telah mengawal pemetaan minat dan bakat siswa sejak semester awal.",
      "\"Kami sangat bersyukur dan bangga atas capaian anak-anak yang berhasil menembus PTN impian lewat jalur SNBP. Ini membuktikan bahwa kualitas pembelajaran di SMKN 2 Kota Mojokerto mampu mengantarkan siswa sukses baik untuk bekerja, melanjutkan kuliah di PTN unggulan, maupun berwirausaha,\" ungkap Iswahyudi.",
      "Sumber: Radar Mojokerto (Jawa Pos Group), https://radarmojokerto.jawapos.com/pendidikan/2404170002/puluhan-siswa-smk-negeri-2-kota-mojokerto-lolos-ptn-lewat-jalur-snbp",
    ],
    gallery: [],
  },
];

// thumb = foto; bila kosong dipakai gradien
export const BERITA: BeritaStaticItem[] = BERITA_DETAIL.map(({ slug, category, title, date, thumb, gradient }) => ({ slug, category, title, date, thumb, gradient }));

export const getBerita = (slug: string): BeritaStaticDetail | null => BERITA_DETAIL.find((berita) => berita.slug === slug) ?? null;
