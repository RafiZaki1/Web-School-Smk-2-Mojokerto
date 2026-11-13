# Kelulusan

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: admin, admin_tu
- Menu: Sidebar > Tata Usaha > Kelulusan
- Halaman: Kelulusan
- Route: `/admin/tu/kelulusan`
- File: `src/app/[locale]/admin/tu/kelulusan/page.tsx`

## 2. Tujuan Halaman
Mengatur mode rilis pengumuman, mengimpor data kelas XII dari Excel/CSV, merevisi data per siswa dengan auto-save, dan mengarsipkan/menghapus angkatan lama.

## 3. Components
- `KelulusanAdmin` dari `@/features/kelulusan`
- `ReleaseSettingsPanel`, `GraduateImportPanel`, `GraduateWorkTable`, `GraduateFilterBar`, `GraduateTable`, `GraduateFormModal`, `GraduateYearPanel` (internal)
- `AutoSaveSelect`, `AutoSaveText`, `AutoSaveIndicator`, `ClassFilter` (`shared/components/admin`)

## 4. API
- `GET/PATCH /api/v1/admin/tu/graduation-settings`
- `GET/POST /api/v1/admin/tu/graduates`, `PATCH/DELETE /graduates/{id}`
- `POST /api/v1/admin/tu/graduates/import` (multipart `file`)
- `GET /graduates/years`, `POST /graduates/archive`, `DELETE /graduates/years`

## 5. Technical Flow
Pengaturan: form RHF + zod, jam rilis diisi dalam WIB lalu dikirim dengan offset +07:00. Tabel: perubahan status/administrasi/catatan langsung `PATCH` (auto-save, catatan debounce 0,9 detik), baris di cache diganti data server.

## 6. State Management
Server state: TanStack Query (`kelulusanKeys`). Form: RHF + zod. Filter tabel dan modal: `useState` lokal.

## 7. SEO Metadata
- Title: "Kelulusan (template panel admin)"
- Description: "-"
- Lainnya: robots noindex

## 8. Permission
Login wajib (`auth:sanctum`). Role `admin` dan `admin_tu`; akun TU hanya bisa membuka `/admin/tu/*` (`isPathAllowed` di `features/admin/constants/admin-menu.ts`).

## 9. Loading Strategy
Skeleton panel pengaturan; spinner tabel.

## 10. Error Strategy
401 -> kembali ke login, 403 -> halaman Forbidden (handler global). Error 422 form tampil per kolom lewat `applyFieldErrors`. Gagal auto-save tampil di indikator "Gagal menyimpan".

## 11. Catatan Implementasi
- Tabel kerja menarik data ulang tiap 5 detik (TanStack Query `refetchInterval`) agar perubahan dari perangkat TU lain terlihat tanpa muat ulang.
- Format impor: `public/templates/format-kelulusan.csv`. Baris rusak dilewati dan dilaporkan nomornya.

## 12. Changelog
- 2026-11-12: Halaman baru. Arsip angkatan tidak lagi tampil publik.
