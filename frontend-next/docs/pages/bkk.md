# Bursa Kerja Khusus (BKK) - SMKN 2 Kota Mojokerto

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: Bursa Kerja Khusus (BKK) - SMKN 2 Kota Mojokerto
- Route: `/bkk`
- File: `src/app/bkk/page.tsx`

## 2. Tujuan Halaman
Jembatan penghubung lulusan SMKN 2 Mojokerto dengan dunia usaha dan dunia industri.

## 3. Components
- `BkkAbout, BkkLokerTerkini, BkkMitra, BkkRekrut, BkkVisiMisi, getBkkContent, getLowonganList` dari `@/features/bkk`
- `Navbar` dari `@/shared/components/layout/Navbar`
- `Footer` dari `@/shared/components/layout/Footer`
- `PageHero` dari `@/shared/components/layout/PageHero`

## 4. API
- `features/bkk/api/adminBkk.api.ts`
- `features/bkk/api/getJob.api.ts`
- `features/bkk/api/getJobOptions.api.ts`
- `features/bkk/api/getJobs.api.ts`
- `features/bkk/services/bkk.service.ts`
- `features/bkk/services/loker-form.service.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Bursa Kerja Khusus (BKK) - SMKN 2 Kota Mojokerto"
- Description: "Jembatan penghubung lulusan SMKN 2 Mojokerto dengan dunia usaha dan dunia industri."

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
