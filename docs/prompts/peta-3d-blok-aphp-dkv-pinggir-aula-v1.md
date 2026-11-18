# Pemindahan Blok APHP & DKV ke Pinggir Aula serta XI APHP 1-2 ke Belakang Aula
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: docs/prompts/peta-3d-sejajar-aula-v1.md
- Dipakai untuk: frontend-next/src/features/peta-3d/data/campus.ts

```text
Ubah tata letak di halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`) sesuai gambar kedua (blok APHP dan DKV), dan kembalikan dua kelas XI APHP ke belakang Aula. Ubah hanya data posisi di `frontend-next/src/features/peta-3d/data/campus.ts`, dan nilai jalan di `Environment.tsx` jika diperlukan. Simpan prompt ini ke `docs/prompts/peta-3d-blok-aphp-dkv-pinggir-aula-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. Blok APHP dan DKV dipindah ke pinggir Aula
- Blok ini terdiri dari dua bagian yang terlihat di gambar kedua:
  - Blok APHP (oranye): XII APHP 2, XII APHP 1, X APHP 2, X APHP 1, dalam dua kolom dan dua baris.
  - Blok DKV (hijau zaitun): XII DKV 2, X DKV 2, XII DKV 1, X DKV 1, dalam dua kolom dan dua baris.
- Pindahkan kedua blok ke pinggir Aula, di sisi yang sama dengan Lab Pastry, Kantin, dan APHP Lab, yaitu di sisi timur Aula.
- Blok APHP di sisi dalam (dekat Aula), blok DKV di sisi luar.
- Urutan dari atas ke bawah pada blok APHP dan DKV mengikuti gambar kedua.
- Jarak antar kotak dalam satu blok sekitar 1 unit, dan jarak antar kedua blok sekitar 2 unit.
- Jarak dari sisi Aula sekitar 3 unit, agar ada ruang untuk jalan kecil.

## 2. Dua kelas XI APHP dikembalikan ke belakang Aula
- XI APHP 1 dan XI APHP 2 dipindah ke belakang Aula, sejajar dengan dinding belakang Aula (nilai z sama dengan sisi belakang Aula, dengan jarak sekitar 1 unit ke luar).
- Urutan dari kiri ke kanan: XI APHP 2, lalu XI APHP 1.

## 3. Jarak dan jalan
- Pertahankan jarak minimal 4 unit untuk jalan kecil antar blok.
- Area di depan Aula harus tetap lega, seperti pada prompt tata letak sebelumnya.
- Semua gedung tetap di dalam `CAMPUS_BOUNDS`.

## 4. Yang tidak boleh berubah
- Jangan ubah `id`, `nama`, `jurusan`, `kelas`, dan `deskripsi`.
- Hanya ubah `posisi`, `rotasi`, dan `ukuran` jika diperlukan.
- Perbarui field `rute` pada gedung yang pindah, dan tandai yang kehilangan rute.
- Fitur yang sudah ada tetap berfungsi: pencarian, teleport, rute, minimap, panel info, label, siang dan malam, panel sudut pandang, multipemain, dan karakter.

## 5. Batasan
- Tanpa pola titik sebagai ornamen.
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.
- Jangan commit atau push.
```
