# Portal Belajar Digital - SMKN 2 Kota Mojokerto

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: Portal Belajar Digital - SMKN 2 Kota Mojokerto
- Route: `/portal-belajar`
- File: `src/app/portal-belajar/page.tsx`

## 2. Tujuan Halaman
Akses cepat layanan belajar SMKN 2 Mojokerto di SISPANDU: ujian online, jadwal pelajaran, absensi, perpustakaan digital, PKL, dan tracer study.

## 3. Components
- `ELearningCard, LayananExplorer, PortalHero, PortalSteps, SISPANDU, TracerStudyBanner` dari `@/features/portal-belajar`
- `PublicPage` dari `@/shared/components/layout/PublicPage`
- `PageHeading` dari `@/shared/components/layout/PageHeading`
- `ContactPanel` dari `@/shared/components/ui/ContactPanel`

## 4. API
- Tidak ada pemanggilan API langsung dari halaman.

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Portal Belajar Digital - SMKN 2 Kota Mojokerto"
- Description: "Akses cepat layanan belajar SMKN 2 Mojokerto di SISPANDU: ujian online, jadwal pelajaran, absensi, perpustakaan digital, PKL, dan tracer study."
- Open Graph: title, description, `type: website`

## 8. Permission
Publik.

## 9. Loading Strategy
Server: `app/loading.tsx` global sebagai fallback Suspense.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
- 2026-11-02: Metadata Open Graph (title, description, type) ditambahkan.
