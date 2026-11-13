# Kelola Prestasi

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Admin
- Menu: Panel Admin
- Halaman: Kelola Prestasi
- Route: `/admin/prestasi`
- File: `src/app/admin/prestasi/page.tsx`

## 2. Tujuan Halaman
Menampilkan daftar prestasi yang dapat diedit, ditambah, atau dihapus oleh admin.

## 3. Components
- `PrestasiAdminList` dari `@/features/prestasi`

## 4. API
- `features/prestasi/api/adminPrestasi.api.ts`
- `features/prestasi/api/getAchievement.api.ts`
- `features/prestasi/api/getAchievements.api.ts`
- `features/prestasi/services/prestasi-form.service.ts`
- `features/prestasi/services/prestasi.service.ts`
- `features/prestasi/hooks/usePrestasiAdmin.ts`

## 5. Technical Flow
Client Component (`"use client"`) → hook TanStack Query → `api/*.api.ts` → `http` (axios).

## 6. State Management
Server state: TanStack Query. Form: react-hook-form + zod. Global: zustand (`auth.store`).

## 7. SEO Metadata
- Title: "Kelola Prestasi"
- Description: "Daftar prestasi yang dapat dikelola oleh admin."
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
- 2026-11-02: Query & mutation admin lewat hook fitur `usePrestasiAdmin.ts` (komponen tidak memanggil API langsung); nama file API mengikuti `<camelCase>.api.ts`.
