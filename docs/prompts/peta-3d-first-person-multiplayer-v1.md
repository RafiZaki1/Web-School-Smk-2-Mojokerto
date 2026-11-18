# Peta 3D First Person & Multipemain Gaya Roblox
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: docs/prompts/peta-3d-lengkap-v1.md
- Dipakai untuk: frontend-next/src/features/peta-3d/

```text
Ubah mode First Person dan tambahkan karakter multipemain (gaya Roblox) di halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`). Referensi visual ada di dua screenshot: (1) First Person dengan kamera setinggi mata di jalan dan taman kota, dan (2) Drone View dengan avatar bernama "@Rafi zaki" di atas, dengan banner status di atas. Ubah hanya `frontend-next/src/features/peta-3d/` dan `frontend-next/src/app/[locale]/peta-3d/` kecuali benar-benar diperlukan. Simpan prompt ini ke `docs/prompts/peta-3d-first-person-multiplayer-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. First Person seperti referensi
- Kamera setinggi mata avatar (sekitar 1,6 unit), FOV sekitar 60 sampai 70 agar terasa lebih lebar dibanding Drone View.
- Tampilan langit biru pucat dengan kabut tipis di kejauhan. Jalan aspal gelap, trotoar abu-abu, rumput hijau, pohon bulat low-poly, lampu jalan, dan bangku.
- Avatar tidak terlihat dari sudut pertama, tetapi bayangan kaki tetap terlihat saat bergerak.
- Di First Person, hilangkan label nama dan sembunyikan avatar sendiri.
- Gunakan pointer lock. Klik layar untuk mouselook, Esc untuk melepas.

## 2. Karakter Roblox-like
- Setiap pemain adalah karakter low-poly: kepala kotak dengan wajah sederhana, badan kotak, lengan dan kaki kotak, serta sepatu. Warna baju dan rambut bisa dipilih.
- Animasi: idle (napas halus), jalan (ayunan kaki dan lengan), dan lompat. Gunakan AnimationMixer atau animasi procedural sederhana.
- Label nama di atas kepala dengan latar gelap rounded, contoh "@Rafi zaki". Label hanya muncul di Drone View dan Third Person. Di First Person, sembunyikan.
- Pemain lain terlihat sebagai karakter yang sama, dengan label nama dan posisi realtime.
- Gerak lokal memakai WASD dan panah, dengan Shift untuk lari. Kecepatan independen dari frame rate (pakai delta).
- Batasi karakter agar tidak keluar `CAMPUS_BOUNDS` dan tidak menembus bangunan.

## 3. Multipemain realtime
- Tambahkan layer realtime. Pilihan yang disarankan: Socket.IO atau Supabase Realtime. Pilih yang paling cocok dengan backend repo dan jelaskan alasannya di ringkasan.
- Kirim posisi, yaw, animasi, dan nama pemain sekitar 10 kali per detik. Interpolasi posisi pemain lain agar gerakannya halus.
- Saat pemain masuk atau keluar, perbarui jumlah pemain.
- Tampilkan badge "1 Online (1 di sini)" di kiri atas, berisi jumlah pemain online dan jumlah yang berada di area yang sama.
- ID pemain dari akun yang login. Jika belum login, gunakan nama tamu acak yang tersimpan di sessionStorage.

## 4. HUD sesuai referensi
- Kiri atas: badge "Kota Digital Khafid Ilham" (ubah nama sesuai data sekolah, misalnya "Peta 3D SMKN 2 Mojokerto"), badge "1 Online", dan badge waktu "12:55 WIB · Siang" (waktu nyata, mode siang atau malam mengikuti jam).
- Tengah atas: badge lokasi "Kawasan Hunian Warga" dengan ikon pin. Badge akses zona:
  - Hijau "Akses: Blok Kenanga 01" jika pemain boleh masuk.
  - Merah "Kawasan Privat" dengan ikon kunci jika dilarang.
  - Gunakan data zona di `campus.ts` (field `zona` dan `akses`).
- Tombol "Suara" dan "Suara Kota" di tengah atas untuk mengatur audio. Audio ambient bisa ditambahkan nanti, jadi saat ini cukup tombol dengan status mute.
- Kanan atas: dropdown "Teleport..." (sudah ada, pertahankan), tombol "Karakter" (membuka pemilih warna baju dan rambut), tombol "Sapa" (mengirim animasi lambaian dan teks singkat ke pemain sekitar), tombol nama pengguna "Rafi zaki", dan "Beranda Web".
- Bawah tengah: bar petunjuk "WASD / Panah: Gerak · E: Interaksi · V: Kamera · Scroll: Zoom".
- Kanan bawah: tombol zoom in, reset, dan zoom out, serta selector mode kamera yang menampilkan "First Person" atau "Drone View" dengan panah dropdown.
- Kiri bawah: joystick virtual (lingkaran besar dengan titik hijau di tengah). Tampil di mobile atau saat sentuhan terdeteksi.

## 5. Interaksi
- Tombol E berinteraksi dengan gedung atau NPC terdekat. Jika di dekat pintu gedung, tampilkan prompt "Tekan E untuk masuk".
- Tombol "Sapa" mengirim animasi lambai dan balon teks ke pemain terdekat (radius 10 unit).

## 6. Performa
- Gunakan InstancedMesh untuk pohon dan lampu.
- Batasi jumlah pemain yang dirender penuh ke 30 terdekat. Pemain lain ditampilkan sebagai titik kecil di minimap.
- Tetap gunakan `frameloop="demand"` di Drone View dan `always` hanya saat berjalan atau animasi aktif.

## 7. Batasan
- Jangan hapus fitur yang sudah ada: pencarian, teleport, rute, minimap, panel info, toggle label, siang dan malam, panel sudut pandang.
- Jangan menambahkan pola titik sebagai ornamen.
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.
- Jangan commit atau push.
```
