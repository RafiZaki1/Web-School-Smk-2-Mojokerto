# Hasil Kuis Jurusan - SMKN 2 Kota Mojokerto

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: Hasil Kuis Jurusan - SMKN 2 Kota Mojokerto
- Route: `/kuis-jurusan/hasil/[code]`
- File: `src/app/kuis-jurusan/hasil/[code]/page.tsx`

## 2. Tujuan Halaman
Menampilkan hasil kuis jurusan berdasarkan kode siswa; halaman ini tidak diindeks oleh mesin pencari.

## 3. Components
- `HasilKuis, getQuizResult` dari `@/features/kuis-jurusan`
- `PublicPage` dari `@/shared/components/layout/PublicPage`
- `BackLink` dari `@/shared/components/ui/BackLink`

## 4. API
- `features/kuis-jurusan/api/adminKuis.api.ts`
- `features/kuis-jurusan/api/kuis.api.ts`
- `features/kuis-jurusan/services/kuis.service.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Hasil Kuis Jurusan - SMKN 2 Kota Mojokerto"
- Description: "Lihat hasil kuis pilihan jurusan beserta kode siswa yang telah diisi."

## 8. Permission
Publik.

## 9. Loading Strategy
ISR: `revalidate` 0 detik (fetch di server). Bila API mati, data statis cadangan dipakai.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `notFound()` untuk 404 detail. `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
