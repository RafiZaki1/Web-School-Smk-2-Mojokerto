# Tambah Jurusan

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Admin
- Menu: Panel Admin
- Halaman: Tambah Jurusan
- Route: `/admin/jurusan/tambah`
- File: `src/app/admin/jurusan/tambah/page.tsx`

## 2. Tujuan Halaman
Menampilkan formulir tambah jurusan, termasuk semua field jurusan dan fasilitas.

## 3. Components
- `JurusanForm` dari `@/features/jurusan`

## 4. API
- `features/jurusan/api/adminJurusan.api.ts`
- `features/jurusan/api/getMajor.api.ts`
- `features/jurusan/api/getMajors.api.ts`
- `features/jurusan/services/jurusan-form.service.ts`
- `features/jurusan/services/jurusan.service.ts`
- `features/jurusan/hooks/useJurusanAdmin.ts`

## 5. Technical Flow
Client Component (`"use client"`) → hook TanStack Query → `api/*.api.ts` → `http` (axios).

## 6. State Management
Server state: TanStack Query. Form: react-hook-form + zod. Global: zustand (`auth.store`).

## 7. SEO Metadata
- Title: "Tambah Jurusan"
- Description: "Halaman formulir untuk menambahkan jurusan."
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
- 2026-11-02: Query & mutation admin lewat hook fitur `useJurusanAdmin.ts` (komponen tidak memanggil API langsung); nama file API mengikuti `<camelCase>.api.ts`.
