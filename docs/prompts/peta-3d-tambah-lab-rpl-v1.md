# Penambahan Gedung Baru LAB. RPL 1 & LAB. RPL 2 di Utara Aula
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: -
- Dipakai untuk: frontend-next/src/features/peta-3d/data/campus.ts

```text
Tambahkan dua gedung baru di halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`): LAB. RPL 1 dan LAB. RPL 2. Keduanya belum ada di data, jadi buat sebagai entri baru di `frontend-next/src/features/peta-3d/data/campus.ts`. Letakkan di atas (utara) Aula SMKN 2 Mojokerto, dengan Aula berada di bawahnya. Kedua lab berada di lantai 1. Simpan prompt ini ke `docs/prompts/peta-3d-tambah-lab-rpl-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. Tambahkan dua entri baru
- Buat entri baru dengan `id` unik: `lab-rpl-1` dan `lab-rpl-2`.
- `nama`: "LAB. RPL 1" dan "LAB. RPL 2".
- `jurusan`: RPL (warna merah muda #f48fb1).
- `kelas`: "Laboratorium RPL".
- `lantai: 1`, `variant: 'standard'`.
- `deskripsi`: "Laboratorium Rekayasa Perangkat Lunak." Tambahkan satu kalimat faktual, jangan mengarang fasilitas.
- Ukuran: sekitar 14 x 6 unit, lebih lebar dari kelas biasa karena ini lab.

## 2. Posisi di atas Aula
- LAB. RPL 1 dan LAB. RPL 2 berada di sisi utara (atas) Aula, sejajar satu sama lain.
- Urutan dari kiri ke kanan: LAB. RPL 1, lalu LAB. RPL 2.
- Jarak antar keduanya 1,5 sampai 2 unit.
- Kedua lab menghadap ke selatan, ke arah Aula.
- Jarak antara sisi bawah lab dan sisi atas Aula sekitar 4 sampai 5 unit, untuk jalan kecil.
- Pastikan jalan kecil tersambung ke jalan utama yang sudah ada.

## 3. Aula
- Aula SMKN 2 Mojokerto tetap di posisinya, berada di bawah kedua lab.
- Jangan ubah `id`, `nama`, dan `deskripsi` Aula.

## 4. Jaga posisi lain
- Jangan memindahkan blok RPL di kiri Gedung Utama, blok LPS di kanan, blok APHP-DKV di tengah bawah, XII KUL 1, XII KUL 2, XII KUL 3, XI APHP 1, dan XI APHP 2.
- Semua gedung, termasuk lab baru, tetap di dalam `CAMPUS_BOUNDS`.
- Pastikan lab baru tidak bertabrakan dengan bangunan lain, termasuk Gedung Utama dan Musholla.

## 5. Rute
- Tambahkan field `rute` untuk LAB. RPL 1 dan LAB. RPL 2, dari gerbang ke pintu lab, mengikuti jalan yang ada.
- Jika ada gedung yang kehilangan rute karena lab baru, tandai di ringkasan.

## 6. Yang tidak boleh berubah
- Fitur yang sudah ada tetap berfungsi: pencarian, teleport, rute, minimap, panel info, label, siang dan malam, panel sudut pandang, multipemain, dan karakter.
- Dropdown pencarian akan otomatis menampilkan dua lab baru. Pastikan urutannya tetap alfabetis.
- Minimap ikut menampilkan dua lab baru.
- Tanpa pola titik sebagai ornamen.

## 7. Batasan
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.
- Jangan commit atau push.
```
