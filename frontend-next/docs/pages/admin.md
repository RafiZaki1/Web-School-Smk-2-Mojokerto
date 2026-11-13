# Dashboard

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Admin
- Menu: Panel Admin
- Halaman: Dashboard
- Route: `/admin`
- File: `src/app/admin/page.tsx`

## 2. Tujuan Halaman
Menampilkan ringkasan statistik dan quick action halaman dashboard admin, termasuk jumlah data berita, jurusan, lulusan, prestasi, ekstrakurikuler, dan BKK.

## 3. Components
- `AdminDashboard` dari `@/features/admin`

## 4. API
- `features/admin/api/getDashboard.api.ts`
- `features/admin/hooks/useAdminResource.ts`
- `features/admin/hooks/useAdminSummary.ts`

## 5. Technical Flow
Client Component (`"use client"`) → hook TanStack Query → `api/*.api.ts` → `http` (axios).

## 6. State Management
Server state: TanStack Query. Form: react-hook-form + zod. Global: zustand (`auth.store`).

## 7. SEO Metadata
- Title: "Dashboard"
- Description: "Ringkasan dan quick action halaman dashboard admin."
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
