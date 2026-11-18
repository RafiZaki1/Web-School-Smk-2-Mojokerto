# Perbaikan Mabar Lintas Perangkat, Identitas Server, Keamanan, & Label Peta 3D
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: docs/prompts/peta-3d-first-person-multiplayer-v1.md
- Dipakai untuk: frontend-next/src/features/peta-3d/, frontend-next/src/app/api/peta-3d/session/route.ts, frontend-next/realtime-server.mjs

```text
Perbaiki halaman Peta 3D di `frontend-next` (route `/peta-3d` dan `/id/peta-3d`). Halaman sudah render, karakter sudah tampil, dan tidak ada error konsol. Masalah utamanya: mabar hanya berjalan antar tab di satu browser, karena `services/multiplayer.ts` memakai `BroadcastChannel`. Pengguna lain di perangkat atau akun berbeda tidak akan saling terlihat. Ubah hanya `frontend-next/src/features/peta-3d/`, `frontend-next/src/app/[locale]/peta-3d/`, dan endpoint backend yang diperlukan. Simpan prompt ini ke `docs/prompts/peta-3d-perbaikan-mabar-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. Mabar lintas perangkat (prioritas utama)
- Ganti `BroadcastChannel` dengan layer realtime server. Pilih satu dan jelaskan alasannya di ringkasan:
  - Socket.IO dengan server Node kecil, atau
  - Supabase Realtime (channel presence dan broadcast) jika backend Supabase sudah dipakai.
- Satu room untuk peta sekolah, misalnya `peta-3d:smkn2`.
- Pemain mengirim `playerId`, `nama`, `warna`, `posisi`, `yaw`, dan `animasi` sekitar 10 kali per detik. Kirim hanya saat ada perubahan.
- Pemain lain diinterpolasi (lerp) agar gerakannya halus.
- Saat pemain masuk atau keluar, karakter ditambahkan atau dihapus, dan badge "N Online" diperbarui dari jumlah pemain di room, bukan dari tab lokal.
- Jika koneksi putus, tampilkan status "Terputus, mencoba ulang..." dan sambung ulang otomatis dengan backoff.

## 2. Identitas pemain
- Jika pengguna login, ambil identitas dari sesi server, bukan dari `localStorage`. Jangan percaya nilai `localStorage` untuk ID pemain.
- Jika belum login, buat ID tamu di server dan simpan di `sessionStorage`. Nama tamu acak, misalnya "Tamu-4729".
- Server memvalidasi token atau ID sebelum menerima paket pemain.

## 3. Keamanan dan batasan di server
- Tolak pergerakan yang terlalu cepat (lebih dari kecepatan maksimal dengan toleransi kecil).
- Tolak posisi di luar `CAMPUS_BOUNDS`.
- Batasi jumlah pemain per room (misalnya 100). Di atas batas, tampilkan "Ruang penuh".
- Batasi laju paket per pemain agar tidak bisa dibanjiri.
- Jangan kirim data pribadi ke pemain lain. Hanya kirim nama tampilan.

## 4. Badge dan daftar pemain
- Badge "N Online (M di sini)" di kiri atas. M adalah jumlah pemain dalam radius 60 unit dari pemain lokal.
- Klik badge untuk membuka daftar pemain. Klik nama untuk melompat kamera ke pemain itu.

## 5. Label "Gerbang Utama" di 3D
- Label gerbang di 3D menempel di atas atap Gedung Utama dan berdesakan dengan label nama pemain di sekitarnya.
- Pindahkan label gerbang ke posisi di depan pintu gerbang (`GERBANG_UTAMA_POS`), atau kecilkan dan sembunyikan saat jarak kamera jauh.
- Label nama pemain harus tetap terbaca dan tidak tumpang tindih dengan label gerbang.

## 6. Pengujian yang belum dilakukan dan wajib dikerjakan
- First Person: pastikan kamera setinggi mata, tanpa avatar sendiri, dengan pointer lock dan Esc untuk melepas.
- Gerak WASD, Shift, dan lompat. Pastikan karakter tidak menembus bangunan.
- Teleport dari dropdown: transisi fade dan avatar berpindah. Pastikan dropdown kembali ke "Teleport...".
- Rute: pilih gedung dengan rute (misalnya XI RPL 2), tekan Rute, pastikan garis dan marker terlihat. Pilih gedung tanpa rute, pastikan pesan "Rute belum tersedia" muncul.
- Tombol Sapa: animasi dan balon teks terlihat di pemain sekitar.
- Zona: pemain di luar zona akses melihat badge "Kawasan Privat".
- Sudut drone: pastikan kompleks memenuhi sekitar 60 sampai 70 persen layar di 1280px.
- Panel Sudut Pandang Kamera dan dropdown Teleport: bandingkan dengan referensi gambar.
- Mobile 390px: joystick, toolbar, minimap, dan panel tidak saling menutupi. Tidak ada scroll horizontal.

## 7. Batasan
- Jangan hapus fitur yang sudah ada: pencarian, teleport, rute, minimap, panel info, label, siang dan malam, panel sudut pandang, Sapa, Karakter.
- Tanpa pola titik sebagai ornamen.
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.
- Jangan commit atau push.
```
