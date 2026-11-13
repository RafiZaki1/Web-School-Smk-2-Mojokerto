# Masuk Panel Admin - SMKN 2 Kota Mojokerto

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: Masuk Panel Admin - SMKN 2 Kota Mojokerto
- Route: `/login`
- File: `src/app/login/page.tsx`

## 2. Tujuan Halaman
Menampilkan form masuk ke panel admin untuk pengelola situs; halaman tidak diindeks mesin pencari.

## 3. Components
- `LoginForm` dari `@/features/auth`

## 4. API
- `features/auth/api/getProfile.api.ts`
- `features/auth/api/login.api.ts`
- `features/auth/api/logout.api.ts`
- `features/auth/hooks/useAdminSession.ts`
- `features/auth/hooks/useLogin.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Masuk Panel Admin - SMKN 2 Kota Mojokerto"
- Description: "Masuk ke panel admin SMKN 2 Kota Mojokerto untuk mengelola konten situs, berita, jurusan, dan data sekolah."

## 8. Permission
Publik (form masuk). Robots noindex.

## 9. Loading Strategy
Server: `app/loading.tsx` global sebagai fallback Suspense.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
