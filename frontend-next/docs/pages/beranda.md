# (lihat metadata layout)

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: (lihat metadata layout)
- Route: `/`
- File: `src/app/page.tsx`

## 2. Tujuan Halaman
Menampilkan halaman beranda (home) utama sekolah: banner pembuka, sambutan pimpinan, statistik, portal belajar, denah, kuis jurusan, jurusan, PKL, mitra, ekstrakurikuler, lulusan, prestasi, dan berita terbaru.

## 3. Components
- `getBeritaKategori, getBeritaList` dari `@/features/berita`
- `getEkstraList` dari `@/features/ekstrakurikuler`
- `DenahInteraktif` dari `@/features/denah`
- `getJurusanList` dari `@/features/jurusan`
- `getLulusanTerbaik, getTestimoniAlumni` dari `@/features/lulusan`
- `getPrestasiList` dari `@/features/prestasi`
- `BeritaSection,
  EkstrakurikulerSection,
  HeroSection,
  JurusanSection,
  KuisJurusanSection,
  LulusanSection,
  MitraSection,
  PklSection,
  PortalBelajarSection,
  PrestasiSection,
  SambutanSection,
  TestimoniAlumniSection,
  VisiMisiSection,
  getHomeData,
  getMitraLanding,
  getSambutanContent,` dari `@/features/home`
- `Navbar` dari `@/shared/components/layout/Navbar`
- `Footer` dari `@/shared/components/layout/Footer`

## 4. API
- `features/berita/api/adminBerita.api.ts`
- `features/berita/api/getArticle.api.ts`
- `features/berita/api/getArticleCategories.api.ts`
- `features/berita/api/getArticles.api.ts`
- `features/berita/services/berita-form.service.ts`
- `features/berita/services/berita.service.ts`
- `features/denah/api/room.api.ts`
- `features/denah/api/getRoute.api.ts`
- `features/denah/hooks/useDenah.ts`
- `features/ekstrakurikuler/api/adminEkstrakurikuler.api.ts`
- `features/ekstrakurikuler/api/getExtracurricular.api.ts`
- `features/ekstrakurikuler/api/getExtracurriculars.api.ts`
- `features/ekstrakurikuler/services/ekstrakurikuler-form.service.ts`
- `features/ekstrakurikuler/services/ekstrakurikuler.service.ts`
- `features/home/api/home.api.ts`
- `features/home/services/home.service.ts`
- `features/home/services/mitra.service.ts`
- `features/jurusan/api/adminJurusan.api.ts`
- `features/jurusan/api/getMajor.api.ts`
- `features/jurusan/api/getMajors.api.ts`
- `features/jurusan/services/jurusan-form.service.ts`
- `features/jurusan/services/jurusan.service.ts`
- `features/lulusan/api/adminLulusan.api.ts`
- `features/lulusan/api/getAlumni.api.ts`
- `features/lulusan/services/lulusan-form.service.ts`
- `features/lulusan/services/lulusan.service.ts`
- `features/prestasi/api/adminPrestasi.api.ts`
- `features/prestasi/api/getAchievement.api.ts`
- `features/prestasi/api/getAchievements.api.ts`
- `features/prestasi/services/prestasi-form.service.ts`
- `features/prestasi/services/prestasi.service.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Beranda - SMKN 2 Kota Mojokerto"
- Description: "Situs resmi SMK Negeri 2 Kota Mojokerto: profil sekolah, jurusan, kuis pilihan jurusan, ekstrakurikuler, prestasi, lulusan, BKK, dan berita terbaru."
- Dinamis: `generateMetadata()`
- Dinamis: `generateMetadata()`

## 8. Permission
Publik.

## 9. Loading Strategy
ISR: `revalidate` 60 detik (fetch di server). Bila API mati, data statis cadangan dipakai.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
- 2026-11-02: Denah: query key dipindah ke `features/denah/constants/query-keys.ts` (termasuk key pencarian), pencarian ruangan lewat hook `useRoomSearch`; file API diganti nama menjadi `room.api.ts` dan `getRoute.api.ts`. SADA memakai useMutation.
