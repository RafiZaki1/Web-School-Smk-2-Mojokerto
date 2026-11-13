# (lihat metadata layout)

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: (lihat metadata layout)
- Route: `/lulusan`
- File: `src/app/lulusan/page.tsx`

## 2. Tujuan Halaman
Menampilkan daftar lulusan terbaik SMK Negeri 2 Kota Mojokerto beserta profil dan testimoni mereka.

## 3. Components
- `LulusanDirektori, getLulusanList` dari `@/features/lulusan`
- `PublicPage` dari `@/shared/components/layout/PublicPage`

## 4. API
- `features/lulusan/api/adminLulusan.api.ts`
- `features/lulusan/api/getAlumni.api.ts`
- `features/lulusan/services/lulusan-form.service.ts`
- `features/lulusan/services/lulusan.service.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Semua Lulusan Terbaik - SMKN 2 Kota Mojokerto"
- Description: "Mereka yang membuktikan pendidikan vokasi di SMKN 2 Mojokerto benar-benar membuka jalan karier."

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
