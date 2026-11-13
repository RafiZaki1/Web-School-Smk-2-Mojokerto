# Tata Tertib & Seragam

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: admin, admin_tu
- Menu: Sidebar > Tata Usaha > Tata Tertib & Seragam
- Halaman: Tata Tertib & Seragam
- Route: `/admin/tu/tata-tertib`
- File: `src/app/[locale]/admin/tu/tata-tertib/page.tsx`

## 2. Tujuan Halaman
Kelola poin tata tertib (CRUD) serta ubah jadwal seragam Senin-Jumat dan seragam praktik 5 jurusan.

## 3. Components
- `TataTertibAdmin` dari `@/features/tata-tertib`
- `SchoolRulesPanel`, `RuleFormModal`, `UniformPanel`, `UniformFormModal` (internal)

## 4. API
- `GET/POST /api/v1/admin/tu/school-rules`, `POST/DELETE /school-rules/{id}`
- `GET /api/v1/admin/tu/uniform-schedules`, `POST /uniform-schedules/{id}`
- `GET /api/v1/admin/tu/practice-uniforms`, `POST /practice-uniforms/{id}`

## 5. Technical Flow
`createAdminResource` + hook admin bersama. Jadwal seragam dan seragam praktik hanya bisa diubah (datanya tetap 5 hari dan 5 jurusan).

## 6. State Management
Server state: TanStack Query (resource `tu-school-rules`, `tu-uniform-schedules`, `tu-practice-uniforms`). Form: RHF + zod.

## 7. SEO Metadata
- Title: "Tata Tertib & Seragam (template panel admin)"
- Description: "-"
- Lainnya: robots noindex

## 8. Permission
Login wajib (`auth:sanctum`). Role `admin` dan `admin_tu`; akun TU hanya bisa membuka `/admin/tu/*` (`isPathAllowed` di `features/admin/constants/admin-menu.ts`).

## 9. Loading Strategy
Spinner `LoadingState` per panel.

## 10. Error Strategy
401 -> kembali ke login, 403 -> halaman Forbidden (handler global). Error 422 form tampil per kolom lewat `applyFieldErrors`. Gagal auto-save tampil di indikator "Gagal menyimpan".

## 11. Catatan Implementasi
- Bagian aturan baru dibuat cukup dengan mengetik nama bagian baru.

## 12. Changelog
- 2026-11-12: Halaman baru.
