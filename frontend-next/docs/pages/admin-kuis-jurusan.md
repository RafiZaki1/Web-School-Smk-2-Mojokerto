# Log Kuis Jurusan

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Admin
- Menu: Panel Admin
- Halaman: Log Kuis Jurusan
- Route: `/admin/kuis-jurusan`
- File: `src/app/admin/kuis-jurusan/page.tsx`

## 2. Tujuan Halaman
Menampilkan log kuis jurusan yang telah diisi siswa, beserta hasil dan status.

## 3. Components
- `KuisJurusanAdminList` dari `@/features/kuis-jurusan`

## 4. API
- `features/kuis-jurusan/api/adminKuis.api.ts`
- `features/kuis-jurusan/api/kuis.api.ts`
- `features/kuis-jurusan/services/kuis.service.ts`
- `features/kuis-jurusan/hooks/useKuisAdmin.ts`

## 5. Technical Flow
Client Component (`"use client"`) → hook TanStack Query → `api/*.api.ts` → `http` (axios).

## 6. State Management
Server state: TanStack Query. Form: react-hook-form + zod. Global: zustand (`auth.store`).

## 7. SEO Metadata
- Title: "Log Kuis Jurusan"
- Description: "Daftar log kuis jurusan yang diisi siswa."
- Robots: `noindex, nofollow` (dari layout admin)

## 8. Permission
Admin (sesi Sanctum). `AdminShell` mengarahkan ke `/login` bila sesi tidak ada; 401 dari API menghapus sesi.

## 9. Loading Strategy
ISR: `revalidate` 0 detik (fetch di server). Bila API mati, data statis cadangan dipakai.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
- 2026-11-02: Query & mutation admin lewat hook fitur `useKuisAdmin.ts` (komponen tidak memanggil API langsung); nama file API mengikuti `<camelCase>.api.ts`.
