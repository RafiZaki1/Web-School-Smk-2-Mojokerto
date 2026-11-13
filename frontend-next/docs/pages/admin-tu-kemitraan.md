# Mitra DU/DI

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: admin, admin_tu
- Menu: Sidebar > Tata Usaha > Mitra DU/DI
- Halaman: Mitra DU/DI
- Route: `/admin/tu/kemitraan`
- File: `src/app/[locale]/admin/tu/kemitraan/page.tsx`

## 2. Tujuan Halaman
CRUD perusahaan mitra beserta logo dan jurusan terkait (5 jurusan).

## 3. Components
- `PartnerAdmin` dari `@/features/kemitraan`
- `PartnerFormModal` (internal)
- `FormCheckboxGroup`, `FormCheckbox`, `FormImageUpload`, `FormText`, `FormTextarea` (`shared/components/form`)

## 4. API
- `GET/POST /api/v1/admin/tu/industry-partners`
- `POST /api/v1/admin/tu/industry-partners/{id}` (ubah, multipart)
- `DELETE /api/v1/admin/tu/industry-partners/{id}`

## 5. Technical Flow
`createAdminResource` + `useAdminList/useAdminSave/useAdminDelete` dari `@/features/admin`. Logo lama tidak dikirim ulang; hanya file baru.

## 6. State Management
Server state: TanStack Query (`adminKeys` resource `tu-industry-partners`). Form: RHF + zod `partnerSchema`. Filter: `useState`.

## 7. SEO Metadata
- Title: "Mitra DU/DI (template panel admin)"
- Description: "-"
- Lainnya: robots noindex

## 8. Permission
Login wajib (`auth:sanctum`). Role `admin` dan `admin_tu`; akun TU hanya bisa membuka `/admin/tu/*` (`isPathAllowed` di `features/admin/constants/admin-menu.ts`).

## 9. Loading Strategy
Spinner `LoadingState`.

## 10. Error Strategy
401 -> kembali ke login, 403 -> halaman Forbidden (handler global). Error 422 form tampil per kolom lewat `applyFieldErrors`. Gagal auto-save tampil di indikator "Gagal menyimpan".

## 11. Catatan Implementasi
- Mitra nonaktif tetap tersimpan, tidak tampil di `/kemitraan`.

## 12. Changelog
- 2026-11-12: Halaman baru.
