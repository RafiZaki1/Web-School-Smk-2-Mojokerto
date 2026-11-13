# Ringkasan Tata Usaha

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: admin, admin_tu
- Menu: Sidebar > Tata Usaha > Ringkasan TU (halaman awal akun TU)
- Halaman: Ringkasan Tata Usaha
- Route: `/admin/tu`
- File: `src/app/[locale]/admin/tu/page.tsx`

## 2. Tujuan Halaman
Angka penting TU: layanan alumni menunggu, pesan tamu baru, kunjungan mendatang, mitra aktif, dan status pengumuman kelulusan.

## 3. Components
- `TuDashboard` dari `@/features/tata-usaha`
- `MetricGrid`, `PageTitle` (`shared/components/admin`)

## 4. API
- `GET /api/v1/admin/tu/dashboard`

## 5. Technical Flow
`useTuDashboard` (refetch 15 detik) -> kartu angka + ringkasan per meja kerja dengan tautan.

## 6. State Management
Server state: TanStack Query (`tataUsahaKeys.dashboard` = `["tu","dashboard"]`, di-invalidate fitur lain setelah perubahan).

## 7. SEO Metadata
- Title: "Ringkasan Tata Usaha (template panel admin)"
- Description: "-"
- Lainnya: robots noindex (layout admin)

## 8. Permission
Login wajib (`auth:sanctum`). Role `admin` dan `admin_tu`; akun TU hanya bisa membuka `/admin/tu/*` (`isPathAllowed` di `features/admin/constants/admin-menu.ts`).

## 9. Loading Strategy
Spinner `LoadingState`.

## 10. Error Strategy
401 -> kembali ke login, 403 -> halaman Forbidden (handler global). Error 422 form tampil per kolom lewat `applyFieldErrors`. Gagal auto-save tampil di indikator "Gagal menyimpan".

## 11. Catatan Implementasi
- Login akun TU diarahkan ke halaman ini (`homePathFor`).

## 12. Changelog
- 2026-11-12: Halaman baru.
