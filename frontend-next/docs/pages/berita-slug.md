# (lihat metadata layout)

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: (lihat metadata layout)
- Route: `/berita/[slug]`
- File: `src/app/berita/[slug]/page.tsx`

## 2. Tujuan Halaman
Menampilkan halaman detail berita/artikel lengkap, termasuk gambar, kategori, penulis, tanggal, dan berita terkini di sidebar.

## 3. Components
- `BeritaSidebar, getBeritaDetail, getBeritaKategori, getBeritaList, toBeritaTeaser` dari `@/features/berita`
- `PublicPage` dari `@/shared/components/layout/PublicPage`

## 4. API
- `features/berita/api/adminBerita.api.ts`
- `features/berita/api/getArticle.api.ts`
- `features/berita/api/getArticleCategories.api.ts`
- `features/berita/api/getArticles.api.ts`
- `features/berita/services/berita-form.service.ts`
- `features/berita/services/berita.service.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Berita - SMKN 2 Kota Mojokerto"
- Description: "Baca detail berita dan artikel dari SMK Negeri 2 Kota Mojokerto, lengkap dengan gambar, kategori, dan berita terkait."
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
