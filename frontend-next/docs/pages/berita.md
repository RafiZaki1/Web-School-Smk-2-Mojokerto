# Berita & Artikel - SMKN 2 Kota Mojokerto

> Dokumen halaman. Dibuat 2026-11-01 dan diperbarui 2026-11-02 sesuai SOP Frontend GetSkill.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: Semua Berita & Artikel
- Route: `/berita`
- File: `src/app/berita/page.tsx`

## 2. Tujuan Halaman
Menampilkan daftar berita dan artikel resmi terbaru dari SMK Negeri 2 Kota Mojokerto, lengkap dengan kategori, pencarian, dan filter.

## 3. Components
- `BeritaExplorerFromUrl, BeritaExplorer, getBeritaKategori, getBeritaList` dari `@/features/berita`
- `PublicPage` dari `@/shared/components/layout/PublicPage`

## 4. API
- `features/berita/api/adminBerita.api.ts`
- `features/berita/api/getArticle.api.ts`
- `features/berita/api/getArticleCategories.api.ts`
- `features/berita/api/getArticles.api.ts`
- `features/berita/services/berita-form.service.ts`
- `features/berita/services/berita.service.ts`

## 5. Technical Flow
Server Component statis (ISR) mengambil daftar berita dan kategori. Filter `?cari=` dan `?kategori=` dibaca di klien oleh `BeritaExplorerFromUrl` (`useSearchParams`) di dalam `Suspense`; fallback-nya daftar tanpa filter.

Server Component → `services` (mapping + kurasi gambar WebP lokal & pembersihan paragraf + fallback `BERITA`) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Semua Berita & Artikel - SMKN 2 Kota Mojokerto"
- Description: "Ikuti terus informasi dan berita-berita terbaru tentang SMK Negeri 2 Kota Mojokerto."

## 8. Permission
Publik.

## 9. Loading Strategy
Server: `app/loading.tsx` global sebagai fallback Suspense.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- Gambar memakai `next/image` dari aset lokal `public/images/news/*.webp`.
- 4 artikel resmi utama: Police Goes to School (Agustus 2026), Penyambutan Siswa Baru / MPLS (Juli 2026), Penerimaan Siswa PKL di KPU Kota Mojokerto (April 2026), dan HUT ke-2 Kabar Terdepan Siswa Kuliner (Juni 2025).

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
- 2026-11-01: Halaman dibuat statis agar bisa di-prefetch; filter URL dipindah ke klien.
- 2026-11-02: Memperbarui data, teks artikel, dan foto WebP untuk 4 berita resmi SMKN 2 Kota Mojokerto di frontend dan backend seeder.
- 2026-11-02: Menurunkan skala tipografi & jarak (h1 48px, judul kartu 28px, tab kategori setara varian `outline`) agar konsisten dengan halaman daftar lain dan judul kartu tidak lebih besar dari judul halaman detail (36px).
