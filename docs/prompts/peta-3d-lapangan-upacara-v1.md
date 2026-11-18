# Penggantian Taman Tengah Menjadi Lapangan Upacara Penuh
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: -
- Dipakai untuk: frontend-next/src/features/peta-3d/data/campus.ts, frontend-next/src/features/peta-3d/components/Building.tsx, frontend-next/src/features/peta-3d/components/Environment.tsx, frontend-next/src/features/peta-3d/utils/collision.ts

```text
Ubah area tengah di halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`) menjadi lapangan upacara penuh, tanpa taman. Taman tengah sekolah (dengan kolam, bebatuan, dan bunga) dihapus dari area ini, dan lapangan dibuat lebar sebagai tempat upacara di depan Gedung Utama. Ubah data dan komponen yang terkait di `frontend-next/src/features/peta-3d/`. Simpan prompt ini ke `docs/prompts/peta-3d-lapangan-upacara-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. Hapus taman tengah
- Cari entri "Taman Tengah Sekolah" di `campus.ts`, dan hapus gedungnya dari data, atau ubah `variant` menjadi `lapangan` tanpa kolam dan bebatuan jika taman itu dipakai sebagai referensi.
- Hapus kolam kecil berwarna biru, bebatuan abu-abu, bunga, dan bangku di sekitar taman tersebut.
- Jika ada pohon di dalam area taman, pindahkan ke tepi area lapangan.

## 2. Buat lapangan upacara penuh
- Area lapangan berada di tengah kompleks, di depan Gedung Utama dan di antara blok RPL dan blok LPS.
- Ukuran lapangan sekitar 50 x 35 unit, dengan sudut yang tegas (persegi panjang).
- Permukaan: rumput hijau rata dengan garis putih tipis (garis tengah dan garis tepi), seperti lapangan upacara.
- Tambahkan tiang bendera di sisi utara lapangan, menghadap Gedung Utama, dengan bendera merah putih kecil.
- Tidak ada pohon, bunga, atau bangku di dalam lapangan. Pohon hanya di tepi lapangan.
- Lapangan terhubung ke jalan utama di sisi selatan dan timur, dengan jalan kecil yang sudah ada.

## 3. Jalan dan pagar
- Jaga jalan kecil dengan lebar minimal 4 unit di sekeliling lapangan.
- Pastikan lapangan tidak menabrak bangunan lain atau pagar keliling.

## 4. Data dan rute
- Jangan ubah `id`, `nama`, `jurusan`, `kelas`, dan `deskripsi` gedung lain.
- Jika ada rute yang melewati area taman lama, perbarui jalurnya agar memutar melalui jalan di tepi lapangan.
- Tandai gedung yang kehilangan rute karena perubahan ini.

## 5. Yang tidak boleh berubah
- Posisi Gedung Utama, Aula, blok RPL, blok LPS, blok APHP-DKV, dan Musholla.
- Fitur yang sudah ada tetap berfungsi: pencarian, teleport, rute, minimap, panel info, label, siang dan malam, panel sudut pandang, multipemain, dan karakter.
- Teleport ke "Taman Tengah Sekolah" harus dihapus dari dropdown, atau diganti ke titik tengah lapangan jika masih ada di data.
- Minimap menyesuaikan dengan lapangan baru.

## 6. Batasan
- Tanpa pola titik sebagai ornamen di UI.
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.
- Jangan commit atau push.
```
