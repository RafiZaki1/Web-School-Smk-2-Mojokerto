# Dunia Bersama Otomatis Peta 3D untuk Production
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: docs/prompts/peta-3d-perbaikan-mabar-v1.md
- Dipakai untuk: frontend-next/realtime-server.mjs, frontend-next/src/features/peta-3d/, docs/peta-3d-env.md

```text
Ubah halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`) agar pengguna yang membuka halaman otomatis masuk ke dunia bersama, tanpa tombol khusus. Ketika seseorang membuka denah, dia langsung muncul di peta dan melihat siapa saja yang sudah ada di sana, termasuk pengguna yang masuk 30 menit lebih awal dan masih aktif. Tidak ada kata "Mabar" atau tombol masuk di antarmuka. Ubah berkas di `frontend-next/src/features/peta-3d/`, `frontend-next/src/app/[locale]/peta-3d/`, dan layanan realtime baru di folder yang sesuai dengan struktur repo. Simpan prompt ini ke `docs/prompts/peta-3d-dunia-bersama-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. Masuk otomatis
- Saat halaman dibuka dan denah tampil, klien langsung tersambung ke dunia bersama `peta-3d:smkn2`.
- Karakter pengguna muncul di gerbang utama. Tidak ada layar tunggu atau pilihan.
- Jika pengguna sudah pernah membuka halaman sebelumnya di sesi yang sama, karakternya muncul di posisi terakhir.
- Hapus semua tombol atau teks yang berkaitan dengan "Mabar", "Masuk Mabar", dan "Keluar Mabar".

## 2. Kehadiran dan pemain yang sudah ada
- Server menyimpan daftar pemain yang sedang aktif. Pemain yang masuk lebih awal tetap terlihat oleh pemain yang masuk kemudian, selama pemain itu masih aktif.
- Pemain dianggap aktif selama tab terbuka dan mengirim detak jantung (heartbeat) setiap 5 detik.
- Pemain dihapus dari dunia jika tidak mengirim detak jantung selama 20 detik, atau jika menutup tab.
- Pemain yang baru masuk langsung melihat semua pemain aktif dengan posisi dan animasi terkini.
- Simpan posisi terakhir setiap pemain di server selama 10 menit, agar pemain yang tab-nya baru dimuat ulang tidak muncul di gerbang lagi.

## 3. Badge jumlah pemain
- Badge "N Online" di kiri atas menampilkan jumlah pemain aktif di dunia bersama dari server.
- Badge "M di sini" menampilkan jumlah pemain dalam radius 60 unit dari pemain lokal.
- Klik badge untuk membuka daftar pemain aktif, lalu klik nama untuk melompat kamera ke pemain itu.

## 4. Layanan realtime untuk production
- Pilih satu layanan dan jelaskan alasannya di ringkasan: Socket.IO dengan server Node kecil, atau Supabase Realtime (presence dan broadcast) jika backend Supabase sudah dipakai.
- Endpoint memakai WSS saat production. Tidak boleh ws:// di halaman https://.
- Tambahkan endpoint `/health`.
- Atur CORS hanya untuk domain production dan localhost untuk pengembangan.
- Alamat layanan disimpan di `NEXT_PUBLIC_PETA3D_REALTIME_URL`. Jika kosong, halaman tetap berjalan sebagai denah 3D biasa, dengan badge "Online: tidak tersedia".
- Dokumentasikan variabel lingkungan di `docs/` tanpa menulis rahasia.

## 5. Identitas
- Jika pengguna login, ambil identitas dari sesi server, bukan dari `localStorage`.
- Jika belum login, server memberi ID tamu dan nama acak seperti "Tamu-4729". Simpan ID di `sessionStorage` agar tetap sama saat halaman dimuat ulang.
- Hanya nama tampilan yang dikirim ke pemain lain. Jangan kirim email, ID akun, atau data pribadi.

## 6. Keamanan dan batas
- Server memvalidasi posisi dalam `CAMPUS_BOUNDS`, kecepatan tidak melebihi batas, dan laju paket maksimal 15 per detik per pemain.
- Batas 100 pemain aktif. Pemain ke-101 melihat dunia tanpa karakter sendiri, dengan pesan "Dunia penuh, coba lagi nanti".
- Filter teks sederhana untuk nama dan pesan sapaan.

## 7. Ketahanan koneksi
- Jika koneksi putus, badge menampilkan "Menyambung ulang..." dan klien mencoba lagi dengan jeda 1, 2, 4, 8 detik, maksimal 15 detik.
- Saat tersambung ulang, klien mengirim ulang posisi terakhir.
- Jika server mati, halaman tetap bisa dijelajahi sendiri dan badge menampilkan "Online: offline".

## 8. Fasilitas
- Panel info gedung menampilkan nama, jurusan (dengan warna), kelas atau fungsi, dan deskripsi.
- Gedung dengan deskripsi kosong atau placeholder menampilkan "Informasi akan diperbarui", dan dicatat di ringkasan.
- Panel bisa dibuka dari dropdown pencarian, minimap, dan klik gedung.

## 9. Performa dan build
- `npm run build` tanpa error atau warning baru di folder peta-3d.
- Bagian 3D tetap dimuat dengan dynamic import dan `ssr: false`. Bundle awal tidak naik lebih dari 300 KB gzip.
- `frameloop="demand"` saat diam dan `always` saat bergerak.
- Uji dengan throttling jaringan 3G. Halaman harus tetap tampil.
- Jika WebGL tidak tersedia, tampilkan pesan dan daftar gedung teks.

## 10. Yang tidak boleh berubah
- Posisi gedung, `id`, `nama`, `jurusan`, `kelas`, dan `deskripsi`.
- Fitur yang sudah ada tetap berfungsi: pencarian, teleport, rute, minimap, label, siang dan malam, panel sudut pandang, karakter, dan Sapa.
- Tanpa pola titik sebagai ornamen di UI.

## 11. Batasan
- Jalankan lint, `npx tsc --noEmit`, dan `npm run build`. Tidak boleh ada error.
- Jangan commit, push, atau deploy tanpa konfirmasi.
```
