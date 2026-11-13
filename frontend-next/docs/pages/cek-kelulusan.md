# Cek Kelulusan

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: Publik (siswa kelas XII)
- Menu: Navbar > Kesiswaan > Cek Kelulusan
- Halaman: Cek Kelulusan
- Route: `/cek-kelulusan`
- File: `src/app/[locale]/cek-kelulusan/page.tsx`

## 2. Tujuan Halaman
Siswa angkatan aktif mengecek hasil kelulusan dengan nama lengkap dan NISN. Tampilan mengikuti mode rilis yang diatur TU: Draft (belum dibuka), Timer (hitung mundur), atau Buka Langsung (form aktif).

## 3. Components
- `CekKelulusanView` dari `@/features/kelulusan`
- `GraduationCheckPanel`, `GraduationPortalCard`, `GraduationCountdown`, `GraduationCheckForm`, `GraduationResultDetails`, `GraduationHelpContacts` (internal fitur)
- `Button` (`shared/components/ui`), `FormText` (`shared/components/form`)

## 4. API
- `GET /api/v1/public/graduation/status` -> `getGraduationStatusApi`
- `POST /api/v1/public/graduation/check` `{ nisn, full_name }` -> `checkGraduationApi` (throttle 10/menit)

## 5. Technical Flow
Client Component: `useGraduationStatus` (refetch 60 detik) menentukan isi kartu. Mode timer: hitung mundur memakai `seconds_until_release` dari server, bukan jam perangkat; saat habis status diambil ulang. Mode open: form RHF + zod `graduationCheckSchema` -> `useCheckGraduation` -> hasil tampil di kartu yang sama.

## 6. State Management
Server state: TanStack Query (`kelulusanKeys.status`). Form: React Hook Form + zod. Detik hitung mundur: `useState` lokal.

## 7. SEO Metadata
- Title: "Cek Kelulusan - SMKN 2 Kota Mojokerto"
- Description: "Cek hasil kelulusan siswa kelas XII ... dengan NISN dan nama lengkap."
- Lainnya: canonical `/cek-kelulusan`

## 8. Permission
Publik. Data hanya keluar bila NISN dan nama cocok (nama dibandingkan tanpa beda huruf besar/kecil, spasi ganda, dan tanda baca).

## 9. Loading Strategy
Skeleton kartu saat status dimuat; tombol "Memeriksa..." saat cek berjalan.

## 10. Error Strategy
Galat API ditangani `handleApiError` (global) atau ditampilkan di form (422 per kolom, 404/403/429 sebagai pesan). `app/error.tsx` untuk galat render.

## 11. Catatan Implementasi
- Direktori lulusan tahun lalu sengaja tidak ditampilkan (permintaan 2026-11-12); endpoint publiknya juga dihapus.
- Kontak bantuan diambil dari `CONTACT` lewat `shared/utils/contact-links.ts`.

## 12. Changelog
- 2026-11-12: Halaman baru. Kartu terpusat, cek dengan nama + NISN, tanpa direktori lulusan.
