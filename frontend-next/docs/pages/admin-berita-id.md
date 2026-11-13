# Ubah Berita

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Admin
- Menu: Panel Admin
- Halaman: Ubah Berita
- Route: `/admin/berita/[id]`
- File: `src/app/admin/berita/[id]/page.tsx`

## 2. Tujuan Halaman
Menampilkan halaman ubah berita, termasuk judul, isi, kategori, gambar, dan pengaturan.

## 3. Components
- `BeritaForm` dari `@/features/berita`

## 4. API
- `features/berita/api/adminBerita.api.ts`
- `features/berita/api/getArticle.api.ts`
- `features/berita/api/getArticleCategories.api.ts`
- `features/berita/api/getArticles.api.ts`
- `features/berita/services/berita-form.service.ts`
- `features/berita/services/berita.service.ts`
- `features/berita/hooks/useBeritaAdmin.ts`

## 5. Technical Flow
Client Component (`"use client"`) → hook TanStack Query → `api/*.api.ts` → `http` (axios).

## 6. State Management
Server state: TanStack Query. Form: react-hook-form + zod. Global: zustand (`auth.store`).

## 7. SEO Metadata
- Title: "Ubah Berita"
- Description: "Halaman untuk mengubah berita/artikel, termasuk judul, isi, dan gambar."
- Robots: `noindex, nofollow` (dari layout admin)

## 8. Permission
Admin (sesi Sanctum). `AdminShell` mengarahkan ke `/login` bila sesi tidak ada; 401 dari API menghapus sesi.

## 9. Loading Strategy
Client: `LoadingState` saat `isPending` dari TanStack Query; tabel memakai skeleton/spinner.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
- 2026-11-02: Query & mutation admin lewat hook fitur `useBeritaAdmin.ts` (komponen tidak memanggil API langsung); nama file API mengikuti `<camelCase>.api.ts`.
