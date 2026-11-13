# Akses Ditolak

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: Akses Ditolak
- Route: `/forbidden`
- File: `src/app/forbidden/page.tsx`

## 2. Tujuan Halaman
Menampilkan halaman 'Akses Ditolak' ketika pengguna mencoba membuka halaman yang tidak diizinkan (status 403 Forbidden).

## 3. Components
- `ErrorState` dari `@/shared/components/feedback/StatusState`

## 4. API
- Tidak ada pemanggilan API langsung dari halaman.

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Akses Ditolak"
- Description: "Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan. Kembali ke beranda."

## 8. Permission
Publik. Dituju saat API mengembalikan 403.

## 9. Loading Strategy
Server: `app/loading.tsx` global sebagai fallback Suspense.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
