# (lihat metadata layout)

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: (lihat metadata layout)
- Route: `/ekstrakurikuler/[slug]`
- File: `src/app/ekstrakurikuler/[slug]/page.tsx`

## 2. Tujuan Halaman
Menampilkan halaman detail ekstrakurikuler, termasuk deskripsi, kegiatan, serta pengumuman atau informasi terkini.

## 3. Components
- `EkstraGallery, EkstraHero, EkstraInfoCards, EkstraPrestasi, EkstraTentang, EkstraTestimoni, getEkstra, getEkstraList` dari `@/features/ekstrakurikuler`
- `Footer` dari `@/shared/components/layout/Footer`
- `BackLink` dari `@/shared/components/ui/BackLink`

## 4. API
- `features/ekstrakurikuler/api/adminEkstrakurikuler.api.ts`
- `features/ekstrakurikuler/api/getExtracurricular.api.ts`
- `features/ekstrakurikuler/api/getExtracurriculars.api.ts`
- `features/ekstrakurikuler/services/ekstrakurikuler-form.service.ts`
- `features/ekstrakurikuler/services/ekstrakurikuler.service.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Ekstrakurikuler - SMKN 2 Kota Mojokerto"
- Description: "Baca informasi ekstrakurikuler di SMK Negeri 2 Kota Mojokerto, termasuk deskripsi kegiatan dan pengumuman."
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
