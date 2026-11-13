# Tambah Ekstrakurikuler

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Admin
- Menu: Panel Admin
- Halaman: Tambah Ekstrakurikuler
- Route: `/admin/ekstrakurikuler/tambah`
- File: `src/app/admin/ekstrakurikuler/tambah/page.tsx`

## 2. Tujuan Halaman
Menampilkan formulir tambah ekstrakurikuler, termasuk penguploadan gambar dan pengisian deskripsi.

## 3. Components
- `EkstrakurikulerForm` dari `@/features/ekstrakurikuler`

## 4. API
- `features/ekstrakurikuler/api/adminEkstrakurikuler.api.ts`
- `features/ekstrakurikuler/api/getExtracurricular.api.ts`
- `features/ekstrakurikuler/api/getExtracurriculars.api.ts`
- `features/ekstrakurikuler/services/ekstrakurikuler-form.service.ts`
- `features/ekstrakurikuler/services/ekstrakurikuler.service.ts`
- `features/ekstrakurikuler/hooks/useEkstrakurikulerAdmin.ts`

## 5. Technical Flow
Client Component (`"use client"`) → hook TanStack Query → `api/*.api.ts` → `http` (axios).

## 6. State Management
Server state: TanStack Query. Form: react-hook-form + zod. Global: zustand (`auth.store`).

## 7. SEO Metadata
- Title: "Tambah Ekstrakurikuler"
- Description: "Halaman formulir untuk menambahkan ekstrakurikuler."
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
- 2026-11-02: Query & mutation admin lewat hook fitur `useEkstrakurikulerAdmin.ts` (komponen tidak memanggil API langsung); nama file API mengikuti `<camelCase>.api.ts`. Ikon dibaca dengan `useWatch`.
