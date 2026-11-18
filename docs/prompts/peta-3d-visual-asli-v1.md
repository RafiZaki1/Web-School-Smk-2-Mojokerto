# Pengayaan Visual Peta 3D Sesuai Denah Ilustrasi Asli (Tekstur Prosedural)
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: -
- Dipakai untuk: frontend-next/src/features/peta-3d/utils/textures.ts, frontend-next/src/features/peta-3d/components/Building.tsx, frontend-next/src/features/peta-3d/components/Environment.tsx

```text
Perkaya tampilan visual halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`) agar mirip dengan denah ilustrasi asli sekolah: atap genteng berwarna, taman dengan tanaman dan bunga, pohon yang bervariasi, bangku, lampu, dan parkiran. Ubah hanya komponen visual di `frontend-next/src/features/peta-3d/components/` (terutama `Building.tsx`, `Environment.tsx`, dan komponen baru jika diperlukan) dan tambahkan utilitas tekstur di `frontend-next/src/features/peta-3d/utils/`. Data posisi dan fitur interaksi tidak boleh diubah. Simpan prompt ini ke `docs/prompts/peta-3d-visual-asli-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. Atap genteng
- Ganti atap datar atau atap pelana polos dengan atap genteng: bidang miring dengan tekstur genteng.
- Buat tekstur genteng dengan `CanvasTexture` secara prosedural: baris genteng bergelombang berwarna oranye bata (#c2410c, #ea580c, #f97316), dengan variasi sedikit antar baris. Tidak perlu file gambar tambahan.
- Gunakan `normalMap` atau `bumpMap` sederhana dari canvas agar genteng terlihat timbul.
- Atap sekolah utama (Gedung Utama, Aula, Musholla, Kantor) boleh berbeda warna sesuai referensi: Kantor atap biru (#1e3a8a), Musholla atap hijau kebiruan (#0f766e), Gedung Utama atap oranye.
- Tepi atap diberi lis tipis putih atau krem.

## 2. Dinding dan jendela
- Dinding krem atau putih dengan sedikit variasi warna per bangunan.
- Jendela biru tipis di sisi depan, seperti pada denah ilustrasi.
- Pintu masuk diberi kanopi tipis di atas pintu untuk Gedung Utama dan Kantor.
- Pilar kecil di depan Gedung Utama dan Kantor.

## 3. Lantai dan jalan
- Jalan aspal abu-abu gelap dengan garis putus-putus putih di jalan utama.
- Trotoar abu-abu terang di tepi jalan.
- Paving krem atau bata di halaman depan Gedung Utama, dengan pola grid halus. Ini hanya untuk tekstur lantai, bukan ornamen UI.
- Halaman terbuka: krem terang.

## 4. Taman dan tanaman
- Rumput hijau cerah dengan variasi warna dari tekstur procedural (dua sampai tiga nuansa hijau).
- Taman dengan kolam kecil berwarna biru, bebatuan abu-abu, dan bunga warna-warni (merah, kuning, ungu) kecil yang disebar menggunakan InstancedMesh.
- Pot bunga dan semak pendek di depan bangunan.
- Pohon bervariasi: pohon bulat hijau, pohon kuning (untuk aksen), dan pohon palem tinggi di tepi jalan. Gunakan InstancedMesh untuk setiap jenis.
- Batang pohon coklat dengan tajuk yang sedikit berbeda ukuran.
- Pohon dan semak di tepi pagar keliling sekolah.

## 5. Fasilitas kecil
- Bangku taman (kayu cokelat) di beberapa titik, dengan InstancedMesh.
- Lampu jalan tipis dengan ujung kuning, sudah ada, perbaiki bentuknya agar mirip denah.
- Tempat sampah kecil di sudut taman.
- Pos satpam: bangunan kecil dengan atap genteng oranye.
- Parkiran motor dengan garis putih, dan deretan motor kecil di dalamnya. Parkiran mobil dengan garis putih dan beberapa mobil kecil berwarna.
- Kios BKK, KOP, dan BANK (jika ada di data) sebagai bangunan kecil dengan atap genteng.

## 6. Pagar dan batas
- Pagar keliling dengan tiang beton abu-abu dan palang besi, dengan gerbang di tengah.
- Tepi area sekolah diberi pagar pendek atau batas hijau.

## 7. Pencahayaan dan warna
- Pertahankan siang dan malam.
- Siang: langit biru muda, bayangan lembut dari DirectionalLight.
- Malam: bangunan tetap terlihat, dengan lampu jalan menyala kuning.
- Jangan membuat tampilan terlalu gelap atau terlalu kontras.

## 8. Performa
- Gunakan InstancedMesh untuk pohon, bunga, bangku, dan lampu.
- Tekstur procedural dibuat sekali dan dipakai ulang lewat `useMemo`.
- Batasi ukuran tekstur ke 512 x 512.
- Pertahankan `frameloop="demand"` di Drone View. Ubah ke `always` hanya saat avatar bergerak.

## 9. Yang tidak boleh berubah
- Jangan ubah posisi, `id`, `nama`, `jurusan`, `kelas`, `deskripsi`, dan `rute` gedung.
- Fitur yang sudah ada tetap berfungsi: pencarian, teleport, rute, minimap, panel info, label, siang dan malam, panel sudut pandang, multipemain, dan karakter.
- Tanpa pola titik sebagai ornamen di UI. Bunga di taman boleh, karena bagian dari scene.

## 10. Batasan
- Jangan menambahkan aset besar (GLB atau gambar) kecuali benar-benar diperlukan. Utamakan tekstur dan geometri procedural.
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.
- Jangan commit atau push.
```
