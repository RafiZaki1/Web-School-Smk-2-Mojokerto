# Koreksi Tata Letak XI APHP 1-2, Lab Pastry-APHP Lab, & XII KUL 1-2
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: docs/prompts/peta-3d-kul-depan-lab-v1.md
- Dipakai untuk: frontend-next/src/features/peta-3d/data/campus.ts, frontend-next/src/features/peta-3d/components/Environment.tsx

```text
Perbaiki tata letak di halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`). Koreksi dari prompt sebelumnya: dua kelas di depan Aula adalah XI APHP 2 dan XI APHP 1, bukan XII KUL 1 dan XII KUL 2. Ubah hanya data posisi di `frontend-next/src/features/peta-3d/data/campus.ts`, dan nilai jalan di `Environment.tsx` jika diperlukan. Simpan prompt ini ke `docs/prompts/peta-3d-koreksi-aphp-kul-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. XI APHP 2 dan XI APHP 1 dipindah ke depan deretan lab
- Pindahkan XI APHP 2 dan XI APHP 1 dari depan Aula ke deretan lab, yaitu di depan Lab Pastry, Kantin, dan APHP Lab.
- Urutan dari kiri ke kanan: XI APHP 2, lalu XI APHP 1.
- Jarak antar keduanya 1,5 sampai 2 unit.

## 2. Lab Pastry, Kantin, dan APHP Lab dipindah ke deretan XII KUL 1 dan XII KUL 2
- Pindahkan Lab Pastry, Kantin, dan APHP Lab ke posisi deretan yang sekarang ditempati XII KUL 1 dan XII KUL 2.
- Urutan dari kiri ke kanan tetap: Lab Pastry, Kantin, APHP Lab.
- Jarak antar lab 1,5 sampai 2 unit.
- Jaga ada jalan minimal 4 unit antara deretan lab dan deretan XI APHP di depannya.

## 3. XII KUL 1 dan XII KUL 2 dikembalikan ke posisi awal
- Kembalikan XII KUL 1 dan XII KUL 2 ke posisi awal, yaitu di pinggir XII KUL 3.
- Urutan dari kiri ke kanan: XII KUL 1, XII KUL 2, XII KUL 3, dengan jarak yang sama.

## 4. Jaga posisi lain
- Aula tetap di posisinya.
- Blok APHP-DKV di pinggir Aula tidak diubah.
- Semua gedung tetap di dalam `CAMPUS_BOUNDS`.
- Jalan kecil dengan jarak minimal 4 unit tetap ada antar blok.

## 5. Yang tidak boleh berubah
- Jangan ubah `id`, `nama`, `jurusan`, `kelas`, dan `deskripsi`.
- Hanya ubah `posisi`, `rotasi`, dan `ukuran` jika diperlukan.
- Perbarui field `rute` pada gedung yang pindah, dan tandai yang kehilangan rute.
- Fitur yang sudah ada tetap berfungsi: pencarian, teleport, rute, minimap, panel info, label, siang dan malam, panel sudut pandang, multipemain, dan karakter.

## 6. Batasan
- Tanpa pola titik sebagai ornamen.
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.
- Jangan commit atau push.
```
