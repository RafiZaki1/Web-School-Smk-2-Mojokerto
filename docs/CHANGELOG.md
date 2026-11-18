# Changelog Docs

## 2026-11-16 · Perbaikan Collision, Wall Sliding, & Kamera First Person (near 0.1)
- Berkas: docs/prompts/peta-3d-first-person-collision-v1.md, frontend-next/src/features/peta-3d/data/colliders.ts, frontend-next/src/features/peta-3d/utils/collision.ts, frontend-next/src/features/peta-3d/components/Avatar.tsx, frontend-next/src/features/peta-3d/components/CameraRig.tsx, frontend-next/src/features/peta-3d/components/Environment.tsx, frontend-next/src/features/peta-3d/components/CampusScene.tsx
- Jenis: ubah
- Ringkasan: Menambahkan data/colliders.ts (pohon, tiang lampu, bangku, pagar bercelah gerbang, kolam), menerapkan sub-stepping 0.2 unit dengan wall sliding X/Z terpisah, step-up trotoar/bangku rendah, percepatan halus, pushOutOfObstacles saat pindah mode, serta near plane 0.1 dan clampFirstPersonCamera.
- Prompt terkait: docs/prompts/peta-3d-first-person-collision-v1.md

## 2026-11-16 · Dunia Bersama Otomatis Production (Heartbeat 5s, Cache Posisi 10m, & Env Docs)
- Berkas: docs/prompts/peta-3d-dunia-bersama-v1.md, docs/peta-3d-env.md, frontend-next/realtime-server.mjs, frontend-next/src/features/peta-3d/services/multiplayer.ts, frontend-next/src/features/peta-3d/store/useCampusStore.ts, frontend-next/src/features/peta-3d/components/Avatar.tsx, frontend-next/src/features/peta-3d/components/UIOverlay.tsx
- Jenis: ubah
- Ringkasan: Menambahkan heartbeat 5 detik dan pembersihan pemain tidak aktif 20 detik, cache posisi terakhir 10 menit di server dan sessionStorage, mode observer untuk pemain ke-101 ("Dunia penuh, coba lagi nanti"), filter teks sederhana, dukungan NEXT_PUBLIC_PETA3D_REALTIME_URL (WSS production, CORS ketat, status tidak tersedia/offline/menyambung ulang), serta dokumentasi env di docs/peta-3d-env.md.
- Prompt terkait: docs/prompts/peta-3d-dunia-bersama-v1.md

## 2026-11-16 · Penggantian Taman Tengah Menjadi Lapangan Upacara Penuh (56 x 27)
- Berkas: docs/prompts/peta-3d-lapangan-upacara-v1.md, frontend-next/src/features/peta-3d/data/campus.ts, frontend-next/src/features/peta-3d/components/Building.tsx, frontend-next/src/features/peta-3d/components/Environment.tsx, frontend-next/src/features/peta-3d/utils/collision.ts
- Jenis: ubah
- Ringkasan: Menghapus entri Taman Tengah Sekolah beserta kolam, bebatuan, bunga, bangku, dan pohon di dalamnya, menggantinya dengan Lapangan Upacara (56 x 27 unit) bergaris putih dan tiang bendera di sisi utara, serta mengalihkan 10 rute yang melewati x = -1 agar memutar lewat tepi barat lapangan.
- Prompt terkait: docs/prompts/peta-3d-lapangan-upacara-v1.md

## 2026-11-16 · Pengayaan Visual Peta 3D (Tekstur Genteng Prosedural, Paving, & Variasi Pohon)
- Berkas: docs/prompts/peta-3d-visual-asli-v1.md, frontend-next/src/features/peta-3d/utils/textures.ts, frontend-next/src/features/peta-3d/components/Building.tsx, frontend-next/src/features/peta-3d/components/Environment.tsx
- Jenis: ubah
- Ringkasan: Menambahkan tekstur CanvasTexture 512x512 prosedural (atap genteng oranye & hijau kebiruan dengan bumpMap, paving halaman Gedung Utama, dan rumput variasi hijau), menambah jendela biru, kanopi pintu, variasi pohon (bulat hijau, kuning, palem), bunga InstancedMesh, tempat sampah, garis jalan putih, serta pagar tiang beton tanpa mengubah data posisi.
- Prompt terkait: docs/prompts/peta-3d-visual-asli-v1.md

## 2026-11-16 · Tambah Tangga Naik ke LAB. RPL 1 & 2 di Gedung Aula
- Berkas: frontend-next/src/features/peta-3d/components/Building.tsx, frontend-next/src/features/peta-3d/components/Avatar.tsx, frontend-next/src/features/peta-3d/utils/collision.ts
- Jenis: tambah
- Ringkasan: Menambahkan tangga luar 12 anak tangga beserta pegangan di sisi depan Gedung Aula menuju LAB. RPL 1 & 2 di lantai atas, serta dukungan jalan naik tangga untuk avatar.
- Prompt terkait: -

## 2026-11-16 · Pindahkan LAB. RPL 1 & LAB. RPL 2 ke Atas Gedung Aula (y = 7.2)
- Berkas: frontend-next/src/features/peta-3d/data/campus.ts
- Jenis: ubah
- Ringkasan: Memindahkan LAB. RPL 1 ([-23.2, 7.2, 24]) dan LAB. RPL 2 ([-8.8, 7.2, 24]) tepat ke atas atap Gedung Aula SMKN 2 Mojokerto (y = 7.2) beserta pembaruan deskripsi dan rute.
- Prompt terkait: docs/prompts/peta-3d-tambah-lab-rpl-v1.md

## 2026-11-16 · Penambahan Gedung LAB. RPL 1 & LAB. RPL 2 di Utara Aula
- Berkas: docs/prompts/peta-3d-tambah-lab-rpl-v1.md, frontend-next/src/features/peta-3d/data/campus.ts
- Jenis: tambah
- Ringkasan: Menambahkan dua entri baru lab-rpl-1 (LAB. RPL 1) dan lab-rpl-2 (LAB. RPL 2) berjurusan RPL (1 lantai, ~13.5x6 unit) di sisi utara Aula dengan jarak 4,5 unit melewati koridor jalan utama z = 15.5 beserta rute dari Gerbang Utama.
- Prompt terkait: docs/prompts/peta-3d-tambah-lab-rpl-v1.md

## 2026-11-16 · Koreksi Tata Letak XI APHP 1-2, Lab Pastry-APHP Lab, & XII KUL 1-3
- Berkas: docs/prompts/peta-3d-koreksi-aphp-kul-v1.md, frontend-next/src/features/peta-3d/data/campus.ts, frontend-next/src/features/peta-3d/components/Environment.tsx
- Jenis: ubah
- Ringkasan: Mengembalikan XII KUL 1 & XII KUL 2 sejajar XII KUL 3 (z = 46), memindahkan Lab Pastry, Kantin, dan APHP Lab ke deretan selatan (z = 49), memindahkan XI APHP 2 & XI APHP 1 ke depan deretan lab (z = 38), serta menyesuaikan jalan pemisah 4 unit di z = 43.
- Prompt terkait: docs/prompts/peta-3d-koreksi-aphp-kul-v1.md

## 2026-11-16 · Pemindahan XII KUL 1-2 ke Depan Deretan Lab & Jalan Pemisah 4 Unit
- Berkas: docs/prompts/peta-3d-kul-depan-lab-v1.md, frontend-next/src/features/peta-3d/data/campus.ts, frontend-next/src/features/peta-3d/components/Environment.tsx
- Jenis: ubah
- Ringkasan: Memindahkan XII KUL 1 & XII KUL 2 ke sisi selatan/depan deretan lab (z = 50, jarak 2 unit), memundurkan Lab Pastry, Kantin, dan APHP Lab ke utara sejauh 7 unit (z = 39), serta menambah jalan pemisah lebar 4 unit di z = 45 yang tersambung ke jalan utama.
- Prompt terkait: docs/prompts/peta-3d-kul-depan-lab-v1.md

## 2026-11-16 · Blok APHP & DKV di Pinggir Timur Aula serta XI APHP 1-2 di Belakang Aula
- Berkas: docs/prompts/peta-3d-blok-aphp-dkv-pinggir-aula-v1.md, frontend-next/src/features/peta-3d/data/campus.ts
- Jenis: ubah
- Ringkasan: Memindahkan blok APHP (XII APHP 2, XII APHP 1, X APHP 2, X APHP 1) dan blok DKV (XII DKV 2, XII DKV 1, X DKV 2, X DKV 1) ke sisi timur Aula dengan jarak 1 unit dalam blok dan 2 unit antar blok, serta mengembalikan XI APHP 2 & XI APHP 1 ke sisi belakang/utara Aula beserta pembaruan rutenya.
- Prompt terkait: docs/prompts/peta-3d-blok-aphp-dkv-pinggir-aula-v1.md

## 2026-11-16 · Penyesuaian Tata Letak Sejajar Aula (Lab Pastry, Kantin, APHP Lab, XI APHP 1-2)
- Berkas: docs/prompts/peta-3d-sejajar-aula-v1.md, frontend-next/src/features/peta-3d/data/campus.ts, frontend-next/src/features/peta-3d/components/Environment.tsx
- Jenis: ubah
- Ringkasan: Menyejajarkan Lab Pastry, Kantin, dan APHP Lab dengan baris XII KUL 1-3 (z = 46), memindahkan XI APHP 2 & 1 sejajar dinding belakang Aula (z = 28), memperluas ruang kosong di depan sisi selatan Aula menjadi 13 unit, serta memperbarui jalan kecil (z = 36.5) dan rute terkait.
- Prompt terkait: docs/prompts/peta-3d-sejajar-aula-v1.md

## 2026-11-16 · Kembalikan X APHP 1-2 & Blok Timur Sesuai Gambar Referensi 2D
- Berkas: frontend-next/src/features/peta-3d/data/campus.ts
- Jenis: ubah
- Ringkasan: Mengembalikan posisi X APHP 1 & X APHP 2 ke baris bawah blok tengah-kanan (sejajar X DKV 2 & X DKV 1) serta mengembalikan XII DKV 1 (Blok Timur), XI DKV 2, dan Parkir Motor Siswa agar sesuai persis dengan gambar referensi 2D.
- Prompt terkait: docs/prompts/peta-3d-cocok-referensi-v1.md

## 2026-11-16 · Model Kotak Kelas Berbingkai Hitam & Lingkungan Cerah Sesuai Referensi 2D
- Berkas: docs/prompts/peta-3d-cocok-referensi-v1.md, frontend-next/src/features/peta-3d/components/Building.tsx, frontend-next/src/features/peta-3d/components/Environment.tsx, frontend-next/src/features/peta-3d/data/campus.ts
- Jenis: ubah
- Ringkasan: Mengubah model gedung kelas dari atap pelana menjadi kotak datar berwarna jurusan dengan bingkai hitam tebal dan label putih-hitam di atasnya, menyesuaikan ukuran (~10x6), serta mencerahkan halaman/jalan abu-abu dengan kebun bunga sudut dan lampu ujung kuning.
- Prompt terkait: docs/prompts/peta-3d-cocok-referensi-v1.md

## 2026-11-16 · Perapian Tata Letak Blok Peta 3D (Aula, XII KUL, & Deretan Timur X APHP)
- Berkas: docs/prompts/peta-3d-tata-letak-v1.md, frontend-next/src/features/peta-3d/data/campus.ts, frontend-next/src/features/peta-3d/components/Environment.tsx
- Jenis: ubah
- Ringkasan: Memindahkan XII KUL 1-3 ke belakang Aula dengan jalan kecil abu-abu lebar 4 unit, merapikan posisi Aula agar menghadap jalan utama, serta memindahkan X APHP 1 & 2 ke deretan timur di bawah XII DKV 1 (Blok Timur).
- Prompt terkait: docs/prompts/peta-3d-tata-letak-v1.md

## 2026-11-16 · Hapus Fitur Denah 3D Statis (/denah-3d)
- Berkas: frontend-next/src/app/[locale]/denah-3d/*, frontend-next/src/features/denah-3d/*, docs/prompts/denah-3d-v1.md
- Jenis: hapus
- Ringkasan: Menghapus fitur Denah 3D statis (/denah-3d) beserta berkas prompt terkait sesuai permintaan pengguna, membatalkan entri "Denah 3D Statis SMK Negeri 2 Mojokerto (/denah-3d)".
- Prompt terkait: -

## 2026-11-16 · Denah 3D Statis SMK Negeri 2 Mojokerto (/denah-3d)
- Berkas: docs/prompts/denah-3d-v1.md, frontend-next/src/app/[locale]/denah-3d/page.tsx, frontend-next/src/features/denah-3d/*
- Jenis: tambah
- Ringkasan: Membuat fitur Denah 3D statis terpisah dari peta-3d pada route /denah-3d berisi 63 entri tata letak denah 2D, OrbitControls, hover/klik info gedung, dropdown cari ruang, dan reset kamera.
- Prompt terkait: docs/prompts/denah-3d-v1.md

## 2026-11-16 · Perbaikan Mabar Lintas Perangkat (Socket.IO), Identitas Server, & Daftar Pemain
- Berkas: docs/prompts/peta-3d-perbaikan-mabar-v1.md, frontend-next/realtime-server.mjs, frontend-next/src/app/api/peta-3d/session/route.ts, frontend-next/src/features/peta-3d/*
- Jenis: ubah
- Ringkasan: Mengganti BroadcastChannel dengan server Socket.IO (room peta-3d:smkn2) agar mabar berjalan lintas perangkat/browser, menambah endpoint sesi bertanda tangan HMAC, validasi kecepatan/bounds/rate-limit di server, daftar pemain online yang dapat diklik, serta perbaikan label Gerbang Utama dan transisi fade Teleport.
- Prompt terkait: docs/prompts/peta-3d-perbaikan-mabar-v1.md

## 2026-11-16 · First Person FOV 65, Karakter Roblox-like, Multipemain Realtime, & HUD Baru
- Berkas: docs/prompts/peta-3d-first-person-multiplayer-v1.md, frontend-next/src/features/peta-3d/*
- Jenis: ubah
- Ringkasan: Memperbarui mode First Person (FOV 65, jalan aspal & trotoar, bayangan kaki), menambah karakter Roblox-like (animasi idle/jalan/lompat/lambai & kustomisasi warna), sinkronisasi multipemain realtime via BroadcastChannel 10 Hz, serta pembaruan HUD status zona, waktu, online, dan interaksi tombol E/Sapa.
- Prompt terkait: docs/prompts/peta-3d-first-person-multiplayer-v1.md

## 2026-11-16 · Perbaikan Peta 3D, Mode Drone, Rute, & Tiga Sudut Pandang Kamera
- Berkas: docs/prompts/peta-3d-lengkap-v1.md, frontend-next/src/features/peta-3d/*
- Jenis: tambah
- Ringkasan: Menyimpan prompt lengkap perbaikan Peta 3D (UI responsif, sudut kamera drone, data rute & deskripsi lengkap, serta tiga mode sudut pandang kamera dengan avatar dan kontrol mobile) beserta pencatatannya di docs.
- Prompt terkait: docs/prompts/peta-3d-lengkap-v1.md
