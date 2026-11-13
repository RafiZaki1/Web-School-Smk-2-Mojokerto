# Fasilitas per Jurusan - SMKN 2 Kota Mojokerto

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: Fasilitas per Jurusan - SMKN 2 Kota Mojokerto
- Route: `/fasilitas`
- File: `src/app/fasilitas/page.tsx`

## 2. Tujuan Halaman
Lab dan workshop yang mendukung praktik langsung tiap program keahlian.

## 3. Components
- `getFasilitasGroups` dari `@/features/fasilitas`
- `PublicPage` dari `@/shared/components/layout/PublicPage`

## 4. API
- `features/fasilitas/services/fasilitas.service.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Fasilitas per Jurusan - SMKN 2 Kota Mojokerto"
- Description: "Lab dan workshop yang mendukung praktik langsung tiap program keahlian."
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
