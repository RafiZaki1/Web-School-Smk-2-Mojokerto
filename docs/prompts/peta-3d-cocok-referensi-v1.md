# Penyesuaian Model 3D Peta Sekolah dengan Referensi Denah 2D
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: -
- Dipakai untuk: frontend-next/src/features/peta-3d/components/Building.tsx, frontend-next/src/features/peta-3d/components/Environment.tsx, frontend-next/src/features/peta-3d/data/campus.ts

```text
Ubah model 3D di halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`) agar tampilannya sama dengan gambar referensi denah 2D yang dikirim (gambar 11 pada percakapan ini: blok RPL, LPS, dan APHP-DKV di sekitar Gedung Utama). Tampilan sekarang masih berupa rumah-rumah oranye dengan atap pelana, yang tidak sesuai. Gambar referensi menunjukkan kotak-kotak kelas berwarna dengan garis hitam tebal dan label di atasnya. Simpan prompt ini ke `docs/prompts/peta-3d-cocok-referensi-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. Gaya kotak kelas (sesuai gambar)
- Setiap kelas adalah satu kotak datar atau bertingkat rendah, dengan garis tepi hitam tebal (sekitar 0,15 unit), seperti pada gambar.
- Warna isi kotak mengikuti jurusan:
  - RPL: merah muda (#f48fb1)
  - LPS: abu-abu kebiruan (#78909c)
  - DKV: hijau zaitun (#6b8e23)
  - APHP: oranye peach (#fb923c)
  - Umum (Aula, Perpustakaan, Kantin): kuning (#eab308)
- Atap datar, bukan atap pelana. Tidak perlu jendela.
- Label nama di atas kotak dengan teks putih tebal di latar hitam, seperti label di gambar.
- Ukuran kotak satu lantai sekitar 10 x 6 unit, dengan jarak antar kotak 1 sampai 1,5 unit.

## 2. Tata letak sesuai gambar
- Ikuti tata letak dari prompt "sesuaikan letak kelas" sebelumnya: blok RPL dua kolom di kiri Gedung Utama, blok LPS dan DKV dua kolom di kanan, blok APHP dan DKV empat kolom dua baris di tengah bawah.
- Gedung Utama di tengah atas, dengan tiang bendera dan halaman terbuka di depannya.
- Musholla, Aula, Perpustakaan, dan Lapangan tetap berada di posisi masing-masing sesuai denah, dengan gaya yang sama (kotak berlabel).

## 3. Gaya lingkungan
- Halaman terbuka berwarna krem atau abu-abu terang, dengan jalan abu-abu yang rapi.
- Pohon bulat hijau dengan batang kecil, dibuat InstancedMesh.
- Kebun bunga kecil di sudut halaman, tanpa pola titik.
- Lampu jalan tipis dengan ujung kuning.

## 4. Yang tidak boleh berubah
- Fitur yang sudah ada tetap berfungsi: pencarian, teleport, rute, minimap, panel info, label, siang dan malam, panel sudut pandang, multipemain, dan karakter.
- Jangan ubah `id`, `nama`, `jurusan`, dan `deskripsi`.
- Hanya ubah tampilan (`variant`, warna, ukuran, dan geometri), posisi, dan rotasi.

## 5. Batasan
- Jangan menambahkan pola titik sebagai ornamen.
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.
- Jangan commit atau push.
```
