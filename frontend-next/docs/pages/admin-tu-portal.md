# Pintasan Portal

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: admin, admin_tu
- Menu: Sidebar > Tata Usaha > Pintasan Portal
- Halaman: Pintasan Portal
- Route: `/admin/tu/portal`
- File: `src/app/[locale]/admin/tu/portal/page.tsx`

## 2. Tujuan Halaman
Mengatur teks, URL, dan status tampil tombol pintasan E-Learning di navbar.

## 3. Components
- `PortalLinkAdmin` dari `@/features/tata-usaha`
- `AutoSaveText`, `AutoSaveSelect`, `AutoSaveIndicator`

## 4. API
- `GET /api/v1/admin/tu/portal-links`
- `PATCH /api/v1/admin/tu/portal-links/{id}`

## 5. Technical Flow
Setiap kolom tersimpan otomatis; setelah berhasil, cache navbar publik (`["portal-links"]`) di-invalidate.

## 6. State Management
Server state: TanStack Query (`tataUsahaKeys.portalLinks`).

## 7. SEO Metadata
- Title: "Pintasan Portal (template panel admin)"
- Description: "-"
- Lainnya: robots noindex

## 8. Permission
Login wajib (`auth:sanctum`). Role `admin` dan `admin_tu`; akun TU hanya bisa membuka `/admin/tu/*` (`isPathAllowed` di `features/admin/constants/admin-menu.ts`).

## 9. Loading Strategy
Spinner `LoadingState`.

## 10. Error Strategy
401 -> kembali ke login, 403 -> halaman Forbidden (handler global). Error 422 form tampil per kolom lewat `applyFieldErrors`. Gagal auto-save tampil di indikator "Gagal menyimpan".

## 11. Catatan Implementasi
- URL wajib diawali http:// atau https:// (validasi backend).

## 12. Changelog
- 2026-11-12: Halaman baru.
