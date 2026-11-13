# (lihat metadata layout)

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: (lihat metadata layout)
- Route: `/kuis-jurusan`
- File: `src/app/kuis-jurusan/page.tsx`

## 2. Tujuan Halaman
Menampilkan kuis interaktif pilihan jurusan berbasis chatbot SADA, dilengkapi statistik dan daftar jurusan.

## 3. Components
- `getJurusanList` dari `@/features/jurusan`
- `CekHasilKuis, IKON_JURUSAN, KuisJurusanChat, getQuizQuestions` dari `@/features/kuis-jurusan`
- `PublicPage` dari `@/shared/components/layout/PublicPage`
- `ContactPanel` dari `@/shared/components/ui/ContactPanel`
- `JurusanIcon` dari `@/shared/components/ui/JurusanIcon`

## 4. API
- `features/jurusan/api/adminJurusan.api.ts`
- `features/jurusan/api/getMajor.api.ts`
- `features/jurusan/api/getMajors.api.ts`
- `features/jurusan/services/jurusan-form.service.ts`
- `features/jurusan/services/jurusan.service.ts`
- `features/kuis-jurusan/api/adminKuis.api.ts`
- `features/kuis-jurusan/api/kuis.api.ts`
- `features/kuis-jurusan/services/kuis.service.ts`
- `features/kuis-jurusan/hooks/useSubmitKuis.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Kuis Pilih Jurusan - SMKN 2 Kota Mojokerto"
- Description: "Ngobrol singkat dengan SADA tentang hobi dan minatmu untuk menemukan jurusan yang paling cocok di SMKN 2 Kota Mojokerto."

## 8. Permission
Publik.

## 9. Loading Strategy
ISR: `revalidate` 0 detik (fetch di server). Bila API mati, data statis cadangan dipakai.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
- 2026-11-02: Kirim jawaban kuis memakai `useSubmitKuis` (useMutation, riwayat disimpan di onSuccess). Form cek kode hasil memakai React Hook Form + zod (`cek-hasil.schema.ts`).
