// Ubah respons API (snake_case, bahasa Inggris) ke bentuk data yang sudah
// dipakai komponen FE sejak versi statis (lib/data/*), agar komponen tidak berubah.

const PRESTASI_TONES = { Akademik: "blue", "Non-akademik": "teal", Olahraga: "indigo", Seni: "sky" };

const BERITA_GRADIENTS = {
  Prestasi: "from-[#3b82f6] to-[#1e40af]",
  "Agenda sekolah": "from-[#334155] to-[#1e293b]",
  "Informasi umum": "from-[#4caf50] to-[#2e7d32]",
  Pengumuman: "from-[#ef5a3c] to-[#b9382a]",
  "Karya siswa": "from-[#e5c100] to-[#b38f00]",
};

const LOKER_COLORS = {
  Perbankan: "#1d52c7",
  "IT & Teknologi": "#0c7870",
  "Kuliner & Hospitality": "#b22321",
  "Desain & Kreatif": "#e8890b",
  Manufaktur: "#4e369f",
};

export const ASPIRASI_STATUS_LABEL = { new: "Baru", in_progress: "Diproses", resolved: "Selesai" };
export const LOKER_STATUS_LABEL = { open: "Aktif", closed: "Tutup" };

export const publishLabel = (isPublished) => (isPublished ? "Aktif" : "Draf");

export function toJurusan(major) {
  return {
    id: major.slug,
    dbId: major.id,
    code: major.code,
    fullName: major.name,
    image: major.image || "/images/sejarah/gedung.jpg",
    tag: major.tagline,
    akreditasi: major.accreditation,
    accent: major.accent_color,
    desc: major.summary,
    tentang: major.description,
    kompetensi: major.competencies ?? [],
    karir: (major.careers ?? []).map((item) => ({ icon: item.icon, title: item.title, desc: item.description })),
    fasilitasTitle: major.facility_title,
    fasilitas: major.facilities ?? [],
    mitra: major.partners?.length ? major.partners.map((item) => ({ ...item, height: "h-12 sm:h-14" })) : null,
    labTarget: major.lab_room_slug,
    status: publishLabel(major.is_published),
    updatedAt: major.updated_at,
  };
}

export function toPrestasiCard(item) {
  return {
    id: item.id,
    slug: item.slug,
    badge: item.rank,
    cardTitle: item.card_title,
    title: item.title,
    date: item.date_label ?? "",
    level: item.level,
    kategori: item.category ?? "Lainnya",
    year: item.year ? String(item.year) : "",
    subtitle: item.subtitle,
    tone: PRESTASI_TONES[item.category] ?? "blue",
    image: item.cover_image,
    siswa: item.student_name,
    kelas: item.student_class,
    status: publishLabel(item.is_published),
    updatedAt: item.updated_at,
  };
}

export function toPrestasiDetail(item) {
  return {
    slug: item.slug,
    predikat: item.rank,
    tingkat: `Tingkat ${item.level}`,
    bulan: item.date_label ?? "",
    title: item.title,
    hero: item.cover_image || "/prestasi-utama.webp",
    siswa: { nama: item.student_name, kelas: item.student_class || "SMKN 2 Kota Mojokerto", foto: item.student_photo },
    tanggal: item.date_range_label || item.date_label || "-",
    lokasi: item.location || "-",
    penyelenggara: item.organizer || "-",
    ringkasan: item.summary || item.title,
    deskripsi: item.paragraphs?.length ? item.paragraphs : [item.subtitle],
    dokumen: item.document,
    testimoni: item.testimonial?.quote
      ? { quote: item.testimonial.quote, nama: item.testimonial.name, jabatan: item.testimonial.position }
      : null,
    galeri: item.gallery?.length
      ? { judul: item.gallery_title || "Galeri Momen", deskripsi: item.gallery_description || "", foto: item.gallery }
      : null,
  };
}

export function toEkstra(item) {
  return {
    id: item.slug,
    dbId: item.id,
    name: item.name,
    subtitle: item.tagline,
    icon: item.icon,
    image: item.cover_image || "/paskib.webp",
    desc: item.summary,
    jadwal: item.schedule || "-",
    lokasi: item.location || "-",
    anggota: item.members || "-",
    tentangLabel: `Tentang ${item.name}`,
    tentangTitle: item.about_title,
    tentang: item.about,
    galleryTitle: item.gallery_title,
    gallery: item.gallery ?? [],
    prestasiTitle: `Pencapaian anggota ${item.name}`,
    prestasi: item.achievements ?? [],
    testimoni: item.testimonials?.[0] ? { quote: item.testimonials[0].quote, author: item.testimonials[0].author || `Anggota ${item.name}` } : null,
    testimonials: item.testimonials ?? [],
    status: publishLabel(item.is_published),
    updatedAt: item.updated_at,
  };
}

export function toBerita(item) {
  return {
    id: item.id,
    slug: item.slug,
    category: item.category,
    title: item.title,
    date: item.published_label ?? "",
    publishedAt: item.published_at,
    thumb: item.cover_image,
    hero: item.cover_image,
    gradient: BERITA_GRADIENTS[item.category] ?? BERITA_GRADIENTS.Prestasi,
    author: item.author,
    excerpt: item.excerpt,
    paragraphs: item.paragraphs ?? [],
    gallery: item.gallery ?? [],
    status: publishLabel(item.is_published),
    updatedAt: item.updated_at,
  };
}

export function toLowongan(job) {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    company: job.company,
    location: job.location || "-",
    kategori: job.category,
    tipe: job.employment_type,
    tutup: job.closes_label || "-",
    closesAt: job.closes_at,
    status: LOKER_STATUS_LABEL[job.status] ?? job.status,
    poster: job.poster,
    banner: {
      bg: job.banner?.color || LOKER_COLORS[job.category] || "#1d52c7",
      headline: job.banner?.headline || job.title,
      sub: job.banner?.subtitle || job.company,
    },
    deskripsi: job.description,
    tanggungJawab: job.responsibilities ?? [],
    kualifikasi: job.qualifications ?? [],
    kontak: { telepon: job.contact_phone, whatsapp: job.contact_phone, email: job.contact_email },
    updatedAt: job.updated_at,
  };
}

export function toLulusan(item) {
  return {
    id: item.id,
    name: item.name,
    jurusan: item.major_code,
    angkatan: item.graduation_year,
    karier: item.career,
    photo: item.photo,
  };
}

export function toAspirasiPublik(item) {
  return {
    kategori: item.category,
    status: ASPIRASI_STATUS_LABEL[item.status] ?? item.status,
    judul: item.title,
    tindakLanjut: item.public_response,
  };
}

export function toAdminAspirasi(item) {
  return {
    id: item.id,
    judul: item.title,
    tanggal: item.created_label,
    waktu: item.created_time_label,
    kategori: item.category,
    status: ASPIRASI_STATUS_LABEL[item.status] ?? item.status,
    statusKey: item.status,
    anonim: item.is_anonymous,
    pengirim: item.sender_name,
    detail: item.detail,
    foto: item.photos ?? [],
    catatan: item.admin_note ?? "",
    tanggapan: item.public_response ?? "",
  };
}
