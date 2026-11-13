# (lihat metadata layout)

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: (lihat metadata layout)
- Route: `/bkk/lowongan/[slug]`
- File: `src/app/bkk/lowongan/[slug]/page.tsx`

## 2. Tujuan Halaman
Menampilkan halaman detail lowongan kerja per perusahaan, termasuk deskripsi, persyaratan, paket kerja, dan lowongan terkait.

## 3. Components
- `LowonganBanner, getBkkContent, getLowonganDetail, getLowonganList` dari `@/features/bkk`
- `BackLink` dari `@/shared/components/ui/BackLink`
- `ContactPanel` dari `@/shared/components/ui/ContactPanel`

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
- Title: "Detail Lowongan - BKK SMKN 2 Kota Mojokerto"
- Description: "Baca detail lowongan kerja dari perusahaan mitra, lengkap deskripsi, persyaratan, dan informasi lowongan lainnya."
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
