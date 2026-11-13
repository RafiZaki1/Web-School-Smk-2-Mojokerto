# Dokumentasi PKL

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: admin, admin_tu
- Menu: Sidebar > Tata Usaha > Dokumentasi PKL
- Halaman: Dokumentasi PKL
- Route: `/admin/tu/dokumentasi-pkl`
- File: `src/app/[locale]/admin/tu/dokumentasi-pkl/page.tsx`

## 2. Tujuan Halaman
CRUD galeri foto kegiatan PKL untuk beranda dan halaman Kemitraan & PKL.

## 3. Components
- `DocumentationAdmin` dari `@/features/kemitraan`
- `DocumentationFormModal` (internal)

## 4. API
- `GET/POST /api/v1/admin/tu/internship-documentations`
- `POST /api/v1/admin/tu/internship-documentations/{id}` (ubah, multipart)
- `DELETE /api/v1/admin/tu/internship-documentations/{id}`

## 5. Technical Flow
Sama dengan Mitra DU/DI. Pilihan mitra diambil dari daftar mitra (`useIndustryPartnersAdmin`).

## 6. State Management
Server state: TanStack Query (`tu-internship-documentations`). Form: RHF + zod `documentationSchema`.

## 7. SEO Metadata
- Title: "Dokumentasi PKL (template panel admin)"
- Description: "-"
- Lainnya: robots noindex

## 8. Permission
Login wajib (`auth:sanctum`). Role `admin` dan `admin_tu`; akun TU hanya bisa membuka `/admin/tu/*` (`isPathAllowed` di `features/admin/constants/admin-menu.ts`).

## 9. Loading Strategy
Spinner `LoadingState`.

## 10. Error Strategy
401 -> kembali ke login, 403 -> halaman Forbidden (handler global). Error 422 form tampil per kolom lewat `applyFieldErrors`. Gagal auto-save tampil di indikator "Gagal menyimpan".

## 11. Catatan Implementasi
- Foto wajib saat menambah data.

## 12. Changelog
- 2026-11-12: Halaman baru.
