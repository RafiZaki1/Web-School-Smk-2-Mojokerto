# Penyesuaian Tata Letak Area Aula, Lab Pastry, Kantin, APHP Lab, & XI APHP
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: docs/prompts/peta-3d-tata-letak-v1.md
- Dipakai untuk: frontend-next/src/features/peta-3d/data/campus.ts, frontend-next/src/features/peta-3d/components/Environment.tsx

```text
Ubah tata letak gedung di halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`) sesuai gambar 13 dan permintaan berikut. Ubah hanya data posisi di `frontend-next/src/features/peta-3d/data/campus.ts`, dan nilai jalan di `Environment.tsx` jika diperlukan. Simpan prompt ini ke `docs/prompts/peta-3d-sejajar-aula-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. Lab Pastry, Kantin, dan APHP Lab
- Ketiganya dipindah agar sejajar dengan baris XII KUL 3 (nilai z yang sama dengan XII KUL 3).
- Urutan dari kiri ke kanan tetap: Lab Pastry, Kantin, APHP Lab.
- Jarak antar ketiganya 1,5 sampai 2 unit.

## 2. XI APHP 1 dan XI APHP 2
- Keduanya dipindah agar sejajar dengan dinding belakang Aula. Artinya nilai z-nya sama dengan sisi belakang Aula, dengan sedikit jarak ke luar (sekitar 1 unit).
- Urutan dari kiri ke kanan: XI APHP 2, lalu XI APHP 1.

## 3. Lebar tata letak di depan Aula
- Lebarkan tata letak ke samping, sehingga ada jarak yang lebih jauh di depan Aula.
- Area di depan Aula (sisi selatan) harus kosong sekitar 12 sampai 15 unit, agar lapangan halaman terlihat lega.
- Bagian belakang XI KUL dan deretan lain harus bergeser ke samping, bukan ke arah Aula.
- Pertahankan jarak minimal 4 unit untuk jalan kecil antar blok.
- Pastikan semua gedung tetap di dalam `CAMPUS_BOUNDS`.

## 4. Yang tidak boleh berubah
- Jangan ubah `id`, `nama`, `jurusan`, `kelas`, dan `deskripsi`.
- Hanya ubah `posisi`, `rotasi`, dan `ukuran` jika diperlukan.
- Rute tetap berfungsi. Perbarui field `rute` pada gedung yang pindah, dan tandai yang kehilangan rute.
- Fitur yang sudah ada tetap berfungsi: pencarian, teleport, rute, minimap, panel info, label, siang dan malam, panel sudut pandang, multipemain, dan karakter.

## 5. Batasan
- Tanpa pola titik sebagai ornamen.
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.
- Jangan commit atau push.
```
