# Produk Unggulan Sekolah - SMKN 2 Kota Mojokerto

> Dokumen halaman. Dibuat 2026-11-01 dari struktur kode; bagian bertanda **[tinjau]** perlu dicek manual.

## 1. Informasi
- Role: Publik
- Menu: Navigasi publik
- Halaman: Produk Unggulan Sekolah - SMKN 2 Kota Mojokerto
- Route: `/produk`
- File: `src/app/produk/page.tsx`

## 2. Tujuan Halaman
Hasil karya nyata siswa SMKN 2 Mojokerto, diproduksi langsung dari praktik industri di sekolah.

## 3. Components
- `getProdukContent` dari `@/features/produk`
- `Navbar` dari `@/shared/components/layout/Navbar`
- `Footer` dari `@/shared/components/layout/Footer`
- `PageHero` dari `@/shared/components/layout/PageHero`

## 4. API
- `features/produk/services/produk.service.ts`

## 5. Technical Flow
Server Component → `services` (mapping + fallback) → `api/*.api.ts` (`fetchPublic`, ISR) → render komponen fitur.

## 6. State Management
Server state di server (ISR). Interaksi UI lokal memakai `useState`.

## 7. SEO Metadata
- Title: "Produk Unggulan Sekolah - SMKN 2 Kota Mojokerto"
- Description: "Hasil karya nyata siswa SMKN 2 Mojokerto, diproduksi langsung dari praktik industri di sekolah."
- Open Graph: title, description, `type: website`

## 8. Permission
Publik.

## 9. Loading Strategy
Server: `app/loading.tsx` global sebagai fallback Suspense.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- [tinjau] Pastikan urutan Loading → Error → Empty → Success sudah sesuai kebutuhan halaman.
- Gambar memakai `next/image`.

## 12. Changelog
- 2026-11-01: Migrasi ke struktur feature-based (SOP frontend getskill).
- 2026-11-02: Metadata Open Graph (title, description, type) ditambahkan.
