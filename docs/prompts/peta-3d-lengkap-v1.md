# Peta 3D Lengkap (Perbaikan UI, Mode Drone, Rute, & Tiga Sudut Pandang Kamera)
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: -
- Dipakai untuk: frontend-next/src/features/peta-3d/, frontend-next/src/app/[locale]/peta-3d/

```text
Kerjakan seluruh perubahan berikut di repo `d:\laragon\www\JHIC`. Kerjakan langsung sampai selesai dan verifikasi, lalu laporkan hasilnya. Jangan commit atau push kecuali diminta.

==================================================
BAGIAN A: ATURAN DOKUMENTASI (`docs/`)
==================================================

Berlaku untuk setiap perubahan di `docs/` dan setiap prompt yang direvisi.

1. Changelog
- Tambahkan entri baru di paling atas `docs/CHANGELOG.md`. Jika belum ada, buat dengan judul "# Changelog Docs".
- Format:
  ```
  ## YYYY-MM-DD · <judul singkat>
  - Berkas: <path relatif dari root repo>
  - Jenis: tambah | ubah | hapus
  - Ringkasan: <satu sampai tiga kalimat, apa dan kenapa>
  - Prompt terkait: <path ke docs/prompts/..., atau "->
  ```
- Tulis dalam Bahasa Indonesia. Jangan hapus entri lama. Perubahan yang membatalkan perubahan sebelumnya ditulis sebagai entri baru yang merujuk ke entri lama.

2. Prompt tersimpan
- Setiap prompt final yang dipakai untuk membuat atau memperbaiki sesuatu disimpan di `docs/prompts/`. Buat folder ini jika belum ada.
- Nama berkas: `<topik-kebab-case>-v<nomor>.md`, contoh `peta-3d-perbaikan-v1.md`.
- Bagian atas berkas:
  ```
  # <Judul prompt>
  - Tanggal: YYYY-MM-DD
  - Versi: <nomor>
  - Menggantikan: <berkas versi sebelumnya, atau "->
  - Dipakai untuk: <berkas atau fitur yang terdampak>
  ```
  Lalu isi prompt persis seperti yang dipakai.
- Revisi selalu jadi versi baru. Jangan menimpa versi lama.
- Simpan prompt ini (Bagian A sampai D) sebagai `docs/prompts/peta-3d-lengkap-v1.md`, dan tulis entri changelog untuknya.

3. Urutan kerja untuk setiap perubahan docs
   a. Baca `docs/CHANGELOG.md` dan daftar `docs/prompts/` sebelum mengubah apa pun.
   b. Lakukan perubahan.
   c. Simpan prompt ke `docs/prompts/` jika ada.
   d. Tulis entri changelog dengan kolom "Prompt terkait" yang benar.

4. Batasan docs
- Jangan membuat berkas di `docs/` selain `CHANGELOG.md`, `prompts/`, dan dokumen yang diminta.
- Jangan mengubah folder `jhic/` hanya karena aturan ini.
- Dokumen lama tidak dihapus tanpa diminta.

==================================================
BAGIAN B: PERBAIKAN HALAMAN PETA 3D
==================================================

Halaman: `frontend-next` route `/peta-3d` dan `/id/peta-3d`. Halaman sudah render tanpa error konsol. Ubah hanya `frontend-next/src/features/peta-3d/` dan `frontend-next/src/app/[locale]/peta-3d/` kecuali benar-benar diperlukan.

File terkait:
- components/UIOverlay.tsx (toolbar, legenda, minimap, tombol, panel)
- components/CameraRig.tsx (DRONE_CAMERA, fly-in, batas zoom, mode kamera)
- components/RoutePath.tsx (garis rute, marker, label gerbang)
- components/Environment.tsx (detail scene)
- components/Building.tsx
- data/campus.ts (60 gedung, GERBANG_UTAMA_POS, field rute, deskripsi)
- store/useCampusStore.ts

B1. Label "Gerbang Utama" menutupi tombol Drone
- Pindahkan label gerbang ke dalam scene (`Html` di `GERBANG_UTAMA_POS`), jangan di area toolbar.
- Tidak boleh menutupi toolbar di 1280px, 1024px, dan 390px.

B2. Toolbar sempit di desktop
- Bagi menjadi dua kelompok: kiri untuk pencarian dan identitas sekolah, kanan untuk kontrol.
- Di bawah 1024px, sembunyikan teks tombol dan tampilkan ikon dengan `title` dan `aria-label`.
- Di bawah 768px, pindahkan kontrol ke bottom bar yang bisa digulir horizontal.

B3. Tombol Rute tanpa penjelasan
- Saat belum ada gedung terpilih, tampilkan `title` dan teks bantuan kecil: "Pilih gedung dulu untuk melihat rute".
- Jika gedung tanpa rute dipilih lalu tombol Rute ditekan, tampilkan pesan "Rute belum tersedia".

B4. Sudut drone terlalu dekat
- Naikkan `DRONE_CAMERA.position` dan sesuaikan `lookAt` agar bagian tengah kompleks terlihat: blok RPL, Gedung Utama, dan Aula.
- Targetkan kompleks memenuhi 60 sampai 70 persen layar di 1280px.
- Sesuaikan `minDistance` dan `maxDistance` agar tetap sesuai.
- Di layar di bawah 768px, gunakan jarak yang berbeda agar kompleks tetap terlihat.
- Laporkan nilai sebelum dan sesudah beserta alasannya.

B5. Data rute belum lengkap
- Hanya 13 entri `rute` yang terisi. Isi untuk semua gedung yang bisa dicapai dari gerbang, dengan waypoint jalan di antara gerbang dan gedung tujuan.
- Gedung yang tidak punya jalur jelas (Parkir Mobil, Lapangan) tidak perlu diisi.
- Laporkan daftar gedung yang masih belum punya `rute`.

B6. Placeholder deskripsi
- Cari "akan diperbarui" di `campus.ts`. Jika ada di data, ganti dengan deskripsi faktual berdasarkan denah 2D. Jika di komentar, hapus.
- Pastikan semua 60 gedung punya deskripsi yang tidak kosong.

B7. Mobile
- Uji di 390px dan 768px. Toolbar, legenda, minimap, dan panel info tidak boleh saling menutupi. Tidak ada scroll horizontal.

B8. Detail scene drone
- Tambahkan detail ringan di `Environment.tsx`: pohon di tepi jalan, lampu jalan, dan bangku, memakai InstancedMesh.
- Jangan tambahkan pola titik sebagai ornamen. Jaga kontras jalan, bangunan, dan rumput.

B9. Logo dan judul
- Logo tetap memakai `/images/brand/emblem-smkn2.png`. Jangan gambar ulang dengan SVG atau AI.
- Judul tetap "Peta 3D Denah Sekolah | SMK Negeri 2 Mojokerto".

==================================================
BAGIAN C: TIGA SUDUT PANDANG KAMERA
==================================================

C1. Mode
1. Drone View (ikon Compass, subtitle "Isometrik 3D", tombol 1): memakai `DRONE_CAMERA` dan OrbitControls. Ini mode default.
2. Third Person (ikon User, subtitle "Di Belakang Avatar", tombol 2): kamera di belakang avatar, jarak sekitar 6 unit, tinggi sekitar 3 unit, lookAt ke kepala avatar. Kamera tidak boleh menembus bangunan. Jika terhalang, dekatkan kamera.
3. First Person (ikon Eye, subtitle "Perspektif Mata", tombol 3): kamera di tinggi mata avatar sekitar 1,6 unit, melihat ke arah pandangan avatar.

C2. Avatar
- Buat avatar low-poly sederhana (kapsul atau box dan silinder, tinggi sekitar 1,7 unit).
- Posisi awal di `GERBANG_UTAMA_POS`, menghadap ke dalam kompleks.
- Di First Person, sembunyikan avatar.
- Simpan posisi dan yaw avatar di store Zustand.

C3. Pergerakan
- W, A, S, D atau panah untuk jalan. Kecepatan sekitar 12 unit per detik. Shift untuk 2x.
- Gunakan `delta` dari `useFrame`.
- Batasi di dalam `CAMPUS_BOUNDS`. Hindari bangunan dengan AABB sederhana dari `posisi` dan `ukuran`.
- Di mobile, joystick virtual di kiri bawah dan geser layar di kanan untuk melihat sekitar. Joystick hanya tampil di Third Person dan First Person.

C4. Mouse look
- Di Third Person dan First Person, klik layar untuk pointer lock. Esc untuk lepas.
- Tampilkan teks: "Klik layar untuk mouselook bebas · Esc lepas".
- Di Drone View, tetap OrbitControls.
- Perpindahan antar mode memakai lerp sekitar 0,6 detik, tidak lompat.

C5. Panel "Sudut Pandang Kamera" di UIOverlay.tsx
- Judul "SUDUT PANDANG KAMERA" dengan badge "Pintasan [V]" di kanan atas. Tekan V untuk buka dan tutup.
- Tiga kartu vertikal: ikon, judul, subtitle, dan nomor pintasan di kanan. Kartu aktif diberi border hijau lime dan titik indikator.
- Teks petunjuk mouse look di bawah kartu.
- Baris "Invert Sumbu Y" dengan toggle NONAKTIF/AKTIF. Default nonaktif.
- Baris "Sensitivitas" dengan pilihan 0,75x, 1x (default), 1,5x. Pilihan aktif berwarna hijau lime.
- Tombol "Reset Sudut Kamera" di bawah. Kembali ke Drone View dan atur ulang invert dan sensitivitas ke default.
- Desktop: kartu gelap semi-transparan, sudut membulat, lebar sekitar 320px. Mobile: bottom sheet.
- Panel diletakkan di kanan dan tidak menutupi minimap atau label gerbang.

C6. Pintasan keyboard
- 1, 2, 3 pindah mode. V buka atau tutup panel. Esc lepas pointer lock.
- Abaikan pintasan saat fokus di input, select, atau textarea.

C7. Store (useCampusStore.ts)
- `cameraMode: 'drone' | 'third' | 'first'` (default 'drone')
- `invertY: boolean` (default false)
- `sensitivity: 0.75 | 1 | 1.5` (default 1)
- `avatarPos`, `avatarYaw`, `isPanelOpen`
- Aksi: `setCameraMode`, `toggleInvertY`, `setSensitivity`, `resetCameraSettings`.

C8. Performa
- Pertahankan `frameloop="demand"` di Drone View. Ubah ke "always" hanya saat Third Person atau First Person aktif, lalu kembali ke "demand".

==================================================
BATASAN UMUM
==================================================
- Jangan ubah struktur route Next.js.
- Jangan hapus fitur yang ada: pencarian, rute, minimap, panel info, toggle label, siang dan malam.
- Ikuti aturan proyek: tanpa ornamen pola titik. Ikuti SOP frontend getskill untuk struktur dan penamaan.
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.

==================================================
VERIFIKASI (WAJIB)
==================================================
1. Jalankan dev server dan buka http://localhost:3000/id/peta-3d dengan browser-automation.
2. Pastikan tidak ada error konsol dan request gagal.
3. Screenshot 1280px dan 390px. Pastikan tidak ada overlap antara label gerbang, toolbar, legenda, minimap, panel, dan tombol bantuan.
4. Pilih gedung dengan rute (misalnya XI RPL 2), tekan Rute, screenshot. Garis, marker bernomor, dan pin tujuan harus terlihat.
5. Pilih gedung tanpa rute, tekan Rute, pastikan pesan "Rute belum tersedia" muncul.
6. Tekan V, lalu pilih Third Person dan First Person. Screenshot keduanya.
7. Uji W, A, S, D: avatar bergerak dan tidak menembus bangunan.
8. Uji sensitivitas dan invert Y. Uji Reset Sudut Kamera.
9. Uji di 390px dengan joystick virtual.
10. Pastikan entri changelog dan berkas prompt di `docs/` sudah tersimpan (Bagian A).
```
