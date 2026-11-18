# Pemindahan XII KUL 1-2 ke Depan Deretan Lab & Mundurkan Deretan Lab
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: -
- Dipakai untuk: frontend-next/src/features/peta-3d/data/campus.ts, frontend-next/src/features/peta-3d/components/Environment.tsx

```text
Ubah tata letak di halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`). Pindahkan dua kelas di depan Aula (XII KUL 1 dan XII KUL 2) ke depan deretan Lab Pastry, Kantin, dan APHP Lab, lalu beri jarak jalan di antara keduanya. Ubah hanya data posisi di `frontend-next/src/features/peta-3d/data/campus.ts`, dan nilai jalan di `Environment.tsx` jika diperlukan. Simpan prompt ini ke `docs/prompts/peta-3d-kul-depan-lab-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. Pindahkan dua kelas ke depan deretan lab
- Pindahkan XII KUL 1 dan XII KUL 2 dari depan Aula ke depan deretan Lab Pastry, Kantin, dan APHP Lab. Mereka berada di sisi selatan deretan lab, menghadap jalan utama.
- Urutan dari kiri ke kanan: XII KUL 1, lalu XII KUL 2.
- Kedua kelas sejajar satu sama lain, dengan jarak 1,5 sampai 2 unit.

## 2. Mundurkan deretan lab satu kotak kelas
- Lab Pastry, Kantin, dan APHP Lab digeser ke belakang (utara) sekitar satu kotak kelas, yaitu sekitar 6 sampai 7 unit.
- Dengan begitu, ada ruang jalan di antara XII KUL 1 dan XII KUL 2 di depan, dan deretan lab di belakang.
- Jalan ini minimal 4 unit lebarnya, dan menyambung ke jalan utama yang sudah ada.

## 3. Jaga posisi lain
- Aula tetap di posisinya. Depan Aula sekarang kosong atau berisi halaman.
- Jangan geser XI APHP 1, XI APHP 2, dan blok APHP-DKV di pinggir Aula.
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
