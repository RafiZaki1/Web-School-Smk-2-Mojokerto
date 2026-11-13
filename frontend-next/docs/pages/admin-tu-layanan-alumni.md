# Layanan Berkas Alumni

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: admin, admin_tu
- Menu: Sidebar > Tata Usaha > Layanan Alumni
- Halaman: Layanan Berkas Alumni
- Route: `/admin/tu/layanan-alumni`
- File: `src/app/[locale]/admin/tu/layanan-alumni/page.tsx`

## 2. Tujuan Halaman
Antrean pengajuan alumni yang bisa dibagi per kelas (12 kelas) agar beberapa petugas memproses paralel dengan satu akun TU.

## 3. Components
- `AlumniServiceQueue` dari `@/features/layanan-alumni`
- `AlumniServiceQueueTable` (internal)
- `ClassFilter`, `AutoSaveSelect`, `AutoSaveText`, `AutoSaveIndicator`, `MetricGrid`

## 4. API
- `GET /api/v1/admin/tu/alumni-services` (paginate + `summary.statuses`, `summary.open_by_class`)
- `PATCH /api/v1/admin/tu/alumni-services/{id}`
- `DELETE /api/v1/admin/tu/alumni-services/{id}`

## 5. Technical Flow
Status diubah -> auto-save `PATCH`. Status "Disetujui" membuat notifikasi lonceng dan mengirim Web Push ke HP pengaju (job antrean di backend).

## 6. State Management
Server state: TanStack Query (`layananAlumniKeys`). Filter: `useState` lokal.

## 7. SEO Metadata
- Title: "Layanan Berkas Alumni (template panel admin)"
- Description: "-"
- Lainnya: robots noindex

## 8. Permission
Login wajib (`auth:sanctum`). Role `admin` dan `admin_tu`; akun TU hanya bisa membuka `/admin/tu/*` (`isPathAllowed` di `features/admin/constants/admin-menu.ts`).

## 9. Loading Strategy
Spinner `LoadingState`.

## 10. Error Strategy
401 -> kembali ke login, 403 -> halaman Forbidden (handler global). Error 422 form tampil per kolom lewat `applyFieldErrors`. Gagal auto-save tampil di indikator "Gagal menyimpan".

## 11. Catatan Implementasi
- Tabel kerja menarik data ulang tiap 5 detik (TanStack Query `refetchInterval`) agar perubahan dari perangkat TU lain terlihat tanpa muat ulang.
- Angka di tombol kelas = pengajuan Menunggu + Diproses.

## 12. Changelog
- 2026-11-12: Halaman baru.
