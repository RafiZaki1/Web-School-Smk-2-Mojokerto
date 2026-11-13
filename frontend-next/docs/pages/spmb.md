# Informasi SPMB - SMKN 2 Kota Mojokerto

> Dokumen halaman. Dibuat 2026-11-01 dan diperbarui 2026-11-02 sesuai SOP Frontend GetSkill.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: Informasi SPMB
- Route: `/spmb`
- File: `src/app/spmb/page.tsx`

## 2. Tujuan Halaman
Panduan lengkap jalur pendaftaran, jadwal tiap tahapan, komposisi penilaian jalur prestasi akademik (60% Nilai Rapor + 40% TKA), statistik rentang nilai rata-rata (70,00 - 80,00), serta data domisili pendaftar tahun sebelumnya.

## 3. Components
- `getJurusanList` dari `@/features/jurusan`
- `DataTable, JadwalTabs, SpmbKomposisiCards, SpmbNilaiSection, SpmbVideo, getSpmbContent, susunNaskah, type SpmbDomisili, type TableColumn` dari `@/features/spmb`
- `PublicPage` dari `@/shared/components/layout/PublicPage`
- `PageHero` dari `@/shared/components/layout/PageHero`
- `PageHeading` dari `@/shared/components/layout/PageHeading`
- `ContactPanel` dari `@/shared/components/ui/ContactPanel`

## 4. API
- `features/jurusan/api/getMajors.api.ts`
- `features/jurusan/services/jurusan.service.ts`
- `features/spmb/services/spmb.service.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback `SPMB_NILAI_2025`) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur (`SpmbNilaiSection`, `SpmbKomposisiCards`, `JadwalTabs`, `DataTable`).

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Informasi SPMB - SMKN 2 Kota Mojokerto"
- Description: "Panduan lengkap jalur pendaftaran, jadwal tiap tahapan, komposisi penilaian 60% Rapor & 40% TKA, serta data nilai & domisili pendaftar tahun sebelumnya."

## 8. Permission
Publik.

## 9. Loading Strategy
Server: `app/loading.tsx` global sebagai fallback Suspense.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- Komponen telah dipecah sesuai batas `< 200` baris per file (`SpmbNilaiSection.tsx` & `SpmbKomposisiCards.tsx`).
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
- 2026-11-02: Menambahkan tabel dan kartu statistik Nilai & Komposisi Penilaian Jalur Prestasi Akademik (60% Rapor + 40% TKA, rentang rata-rata 70,00–80,00, distribusi > 90,00) ke halaman Informasi SPMB (`/spmb`).
- 2026-11-02: Video alur SPMB kini hanya tampil sebagai popup layar penuh saat halaman dibuka (klik di mana saja, tombol Lewati, atau Esc untuk menutup); bagian "Video panduan" di halaman dihapus.
- 2026-11-02: Menambahkan kalkulator nilai gabungan (`SpmbKalkulator`) di bawah tabel nilai: dua input (rata-rata rapor & nilai TKA), hasil dihitung di browser (`utils/nilai-gabungan.ts`, tanpa AI/server) beserta satu kalimat posisi nilai dibanding data tahun lalu.
