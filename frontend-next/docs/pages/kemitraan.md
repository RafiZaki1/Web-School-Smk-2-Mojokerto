# Kemitraan & PKL

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: Publik
- Menu: Navbar > Informasi > Kemitraan & PKL
- Halaman: Kemitraan & PKL
- Route: `/kemitraan`
- File: `src/app/[locale]/kemitraan/page.tsx`

## 2. Tujuan Halaman
Menampilkan mitra DU/DI per jurusan dan galeri dokumentasi PKL yang dikelola TU.

## 3. Components
- `KemitraanView`, `getKemitraanData` dari `@/features/kemitraan`
- `PartnerDirectory` (filter 5 jurusan), `PklGallery` (internal fitur)

## 4. API
- `GET /api/v1/public/industry-partners`
- `GET /api/v1/public/internship-documentations`

## 5. Technical Flow
Server Component -> `services/kemitraan.service.ts` -> `api/kemitraanPublic.api.ts` (`fetchPublic`, ISR 60 detik) -> render. Filter jurusan di client.

## 6. State Management
Server state di server (ISR). Filter jurusan: `useState` lokal.

## 7. SEO Metadata
- Title: "Kemitraan & PKL - SMKN 2 Kota Mojokerto"
- Description: "Daftar mitra DU/DI ... beserta dokumentasi PKL siswa."
- Lainnya: canonical `/kemitraan`

## 8. Permission
Publik. Hanya mitra aktif dan dokumentasi yang dipublikasikan.

## 9. Loading Strategy
Server: `app/[locale]/loading.tsx`.

## 10. Error Strategy
API tidak bisa dihubungi -> `ErrorState`. Data kosong -> `EmptyState` per bagian.

## 11. Catatan Implementasi
- Section `PklDocumentationSection` (6 foto terbaru) juga tampil di beranda bila ada data.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-12: Halaman baru.
