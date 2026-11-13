# Tata Tertib & Seragam

> Dokumen halaman modul Tata Usaha. Dibuat 2026-11-12.

## 1. Informasi
- Role: Publik
- Menu: Navbar > Informasi > Tata Tertib & Seragam
- Halaman: Tata Tertib & Seragam
- Route: `/tata-tertib`
- File: `src/app/[locale]/tata-tertib/page.tsx`

## 2. Tujuan Halaman
Menampilkan poin tata tertib per bagian, jadwal seragam Senin-Jumat, dan seragam praktik produktif 5 jurusan.

## 3. Components
- `TataTertibView`, `getStudentGuide` dari `@/features/tata-tertib`
- `UniformCard` (internal fitur)

## 4. API
- `GET /api/v1/public/student-guide` -> `{ rules, uniform_schedules, practice_uniforms }`

## 5. Technical Flow
Server Component -> `services/tata-tertib.service.ts` (`groupRules` mengelompokkan per bagian) -> `fetchPublic` (ISR 60 detik).

## 6. State Management
Server state di server (ISR). Tidak ada state client.

## 7. SEO Metadata
- Title: "Tata Tertib & Seragam - SMKN 2 Kota Mojokerto"
- Description: "Tata tertib siswa ..., jadwal seragam harian, dan seragam praktik tiap jurusan."
- Lainnya: canonical `/tata-tertib`

## 8. Permission
Publik. Hanya poin aturan yang aktif.

## 9. Loading Strategy
Server: `app/[locale]/loading.tsx`.

## 10. Error Strategy
API tidak bisa dihubungi -> `ErrorState`. Bagian kosong -> `EmptyState`.

## 11. Catatan Implementasi
- Foto seragam memakai `next/image`; tanpa foto tampil teks "Foto belum tersedia".
- Seragam praktik tanpa foto unggahan TU memakai foto halaman jurusan (`constants/practice-uniform-photos.ts`, lewat `uniformImage`).

## 12. Changelog
- 2026-11-12: Halaman baru.
- 2026-11-13: Seragam praktik memakai foto jurusan sebagai foto bawaan; deskripsi seeder disesuaikan dengan seragam di foto.
