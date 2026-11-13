# (lihat metadata layout)

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: (lihat metadata layout)
- Route: `/prestasi/[slug]`
- File: `src/app/prestasi/[slug]/page.tsx`

## 2. Tujuan Halaman
Menampilkan halaman detail prestasi siswa, termasuk ringkasan, kategori, dan gambar.

## 3. Components
- `PrestasiArticle, PrestasiAside, PrestasiGallery, PrestasiHero, PrestasiMiniFooter, getPrestasi, getPrestasiList` dari `@/features/prestasi`
- `Navbar` dari `@/shared/components/layout/Navbar`
- `Footer` dari `@/shared/components/layout/Footer`

## 4. API
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
- Title: "Prestasi - SMKN 2 Kota Mojokerto"
- Description: "Baca detail prestasi siswa SMKN 2 Kota Mojokerto, lengkap ringkasan, kategori, dan gambar."
- Dinamis: `generateMetadata()`
- Dinamis: `generateMetadata()`

## 8. Permission
Publik.

## 9. Loading Strategy
Server: `app/loading.tsx` global sebagai fallback Suspense.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `notFound()` untuk 404 detail. `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
