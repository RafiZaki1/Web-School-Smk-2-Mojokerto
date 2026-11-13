# Buku Tamu

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: admin, admin_tu
- Menu: Sidebar > Tata Usaha > Buku Tamu
- Halaman: Buku Tamu
- Route: `/admin/tu/buku-tamu`
- File: `src/app/[locale]/admin/tu/buku-tamu/page.tsx`

## 2. Tujuan Halaman
Mencatat dan memantau jadwal kunjungan tamu instansi, serta memproses pesan pengunjung website.

## 3. Components
- `BukuTamuAdmin` dari `@/features/buku-tamu`
- `GuestVisitsPanel`, `GuestVisitFormModal`, `GuestMessagesPanel` (internal)
- `AutoSaveSelect`, `AutoSaveText`, `AutoSaveIndicator`

## 4. API
- `GET/POST /api/v1/admin/tu/guest-visits`, `PATCH/DELETE /guest-visits/{id}`
- `GET /api/v1/admin/tu/guest-messages`, `PATCH/DELETE /guest-messages/{id}`

## 5. Technical Flow
Status dan catatan auto-save `PATCH`. Kunjungan baru dicatat lewat modal (RHF + zod `guestVisitSchema(false)`).

## 6. State Management
Server state: TanStack Query (`bukuTamuKeys`). Filter: `useState`.

## 7. SEO Metadata
- Title: "Buku Tamu (template panel admin)"
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

## 12. Changelog
- 2026-11-12: Halaman baru.
