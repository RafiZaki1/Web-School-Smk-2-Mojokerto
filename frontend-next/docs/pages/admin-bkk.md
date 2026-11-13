# Kelola Loker & BKK

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Admin
- Menu: Panel Admin
- Halaman: Kelola Loker & BKK
- Route: `/admin/bkk`
- File: `src/app/admin/bkk/page.tsx`

## 2. Tujuan Halaman
Menampilkan daftar konten BKK (visi, misi, rekrutmen, mitra) yang dapat diedit oleh admin.

## 3. Components
- `LokerAdminList` dari `@/features/bkk`

## 4. API
- `features/bkk/api/adminBkk.api.ts`
- `features/bkk/api/getJob.api.ts`
- `features/bkk/api/getJobOptions.api.ts`
- `features/bkk/api/getJobs.api.ts`
- `features/bkk/services/bkk.service.ts`
- `features/bkk/services/loker-form.service.ts`
- `features/bkk/hooks/useLokerAdmin.ts`

## 5. Technical Flow
Client Component (`"use client"`) → hook TanStack Query → `api/*.api.ts` → `http` (axios).

## 6. State Management
Server state: TanStack Query. Form: react-hook-form + zod. Global: zustand (`auth.store`).

## 7. SEO Metadata
- Title: "Kelola Loker & BKK"
- Description: "Halaman untuk mengelola konten BKK, termasuk visi, misi, rekrutmen, dan mitra."
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
- 2026-11-02: Query & mutation admin lewat hook fitur `useLokerAdmin.ts` (komponen tidak memanggil API langsung); nama file API mengikuti `<camelCase>.api.ts`.
