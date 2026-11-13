# Jurusan Tidak Ditemukan - SMKN 2 Kota Mojokerto

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: Jurusan Tidak Ditemukan - SMKN 2 Kota Mojokerto
- Route: `/jurusan/[id]`
- File: `src/app/jurusan/[id]/page.tsx`

## 2. Tujuan Halaman
Menampilkan halaman detail jurusan/program keahlian, termasuk deskripsi, kompetensi, prospek karier, mitra, dan fasilitas.

## 3. Components
- `getMitraLanding` dari `@/features/home`
- `FasilitasBelajar, getJurusan, getJurusanList, JurusanHero, KompetensiUtama, MitraJurusan, ProspekKarier, TentangJurusan` dari `@/features/jurusan`
- `Navbar` dari `@/shared/components/layout/Navbar`
- `Footer` dari `@/shared/components/layout/Footer`

## 4. API
- `features/home/api/home.api.ts`
- `features/home/services/home.service.ts`
- `features/home/services/mitra.service.ts`
- `features/jurusan/api/adminJurusan.api.ts`
- `features/jurusan/api/getMajor.api.ts`
- `features/jurusan/api/getMajors.api.ts`
- `features/jurusan/services/jurusan-form.service.ts`
- `features/jurusan/services/jurusan.service.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Jurusan Tidak Ditemukan - SMKN 2 Kota Mojokerto"
- Description: "Pilih jurusan di SMK Negeri 2 Kota Mojokerto, lengkap deskripsi, kompetensi, karier, mitra, dan fasilitas."
- Dinamis: `generateMetadata()`

## 8. Permission
Publik.

## 9. Loading Strategy
ISR: `revalidate` 60 detik (fetch di server). Bila API mati, data statis cadangan dipakai.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `notFound()` untuk 404 detail. `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
