# (lihat metadata layout)

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: (lihat metadata layout)
- Route: `/denah`
- File: `src/app/denah/page.tsx`

## 2. Tujuan Halaman
Halaman pengalihan (redirect) menuju halaman denah interaktif sekolah; pengunjung dialihkan ke /#denah.

## 3. Components
- (tidak ada komponen fitur; halaman murni layout)

## 4. API
- Tidak ada pemanggilan API langsung dari halaman.

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Denah Sekolah - SMKN 2 Kota Mojokerto"
- Description: "Cari lokasi ruangan, lab, dan fasilitas di SMK Negeri 2 Kota Mojokerto melalui denah interaktif."

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
