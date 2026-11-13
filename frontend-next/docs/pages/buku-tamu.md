# Buku Tamu

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: Publik
- Menu: Navbar > Informasi > Buku Tamu
- Halaman: Buku Tamu
- Route: `/buku-tamu`
- File: `src/app/[locale]/buku-tamu/page.tsx`

## 2. Tujuan Halaman
Pengunjung mengirim pesan ke TU atau tamu instansi mengajukan jadwal kunjungan.

## 3. Components
- `BukuTamuView` dari `@/features/buku-tamu`
- `GuestMessageForm`, `GuestVisitForm`, `GuestVisitFields`, `GuestBookSent` (internal fitur)

## 4. API
- `POST /api/v1/public/guest-book/messages` (throttle 5/menit)
- `POST /api/v1/public/guest-book/visits` (throttle 5/menit)

## 5. Technical Flow
Client Component: pilih jenis (pesan/kunjungan) -> form RHF + zod -> mutation -> pesan konfirmasi dari server.

## 6. State Management
Form: RHF + zod (`guestMessageSchema`, `guestVisitSchema(true)`). Pilihan jenis form: `useState` lokal.

## 7. SEO Metadata
- Title: "Buku Tamu - SMKN 2 Kota Mojokerto"
- Description: "Kirim pesan ke Tata Usaha ... atau ajukan jadwal kunjungan instansi."
- Lainnya: canonical `/buku-tamu`

## 8. Permission
Publik.

## 9. Loading Strategy
Tombol "Mengirim..." saat submit.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global) atau ditampilkan di form (422 per kolom, 404/403/429 sebagai pesan). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- Pesan wajib menyertakan email atau nomor HP. Tanggal kunjungan tidak boleh lewat.

## 12. Changelog
- 2026-11-12: Halaman baru.
