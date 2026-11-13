# Tinjau Kuis Jurusan

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Admin
- Menu: Panel Admin
- Halaman: Tinjau Kuis Jurusan
- Route: `/admin/kuis-jurusan/[id]`
- File: `src/app/admin/kuis-jurusan/[id]/page.tsx`

## 2. Tujuan Halaman
Menampilkan halaman lihat hasil kuis jurusan per siswa, termasuk jawaban dan nilai.

## 3. Components
- `TinjauKuisJurusan` dari `@/features/kuis-jurusan`

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
- Title: "Tinjau Kuis Jurusan"
- Description: "Halaman untuk melihat hasil kuis jurusan per siswa."
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
- 2026-11-02: Simpan tinjauan memakai `useReviewKuis` (useMutation + invalidasi cache admin), bukan useMutation di komponen; nilai `hasil` dibaca dengan `useWatch`.
