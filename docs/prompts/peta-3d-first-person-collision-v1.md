# Perbaikan Pergerakan Karakter & Kamera First Person (Wall Sliding, Sub-Step, & Colliders)
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: -
- Dipakai untuk: frontend-next/src/features/peta-3d/data/colliders.ts, frontend-next/src/features/peta-3d/utils/collision.ts, frontend-next/src/features/peta-3d/components/Avatar.tsx, frontend-next/src/features/peta-3d/components/CameraRig.tsx, frontend-next/src/features/peta-3d/components/Environment.tsx, frontend-next/src/features/peta-3d/components/CampusScene.tsx

```text
Perbaiki pergerakan karakter dan kamera di mode First Person pada halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`). Saat ini karakter sering tersangkut di sudut bangunan, pagar, pohon, dan tiang lampu, dan kamera kadang menembus dinding. Ubah hanya `frontend-next/src/features/peta-3d/utils/collision.ts`, `components/Avatar.tsx`, `components/CameraRig.tsx`, dan data collider di `data/campus.ts` jika diperlukan. Jangan ubah posisi gedung, `id`, `nama`, atau fitur lain. Simpan prompt ini ke `docs/prompts/peta-3d-first-person-collision-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

Catatan: berkas `realtime-server.mjs` tidak terkait perbaikan ini, jangan diubah.

## 1. Penyebab tersangkut
- Periksa `utils/collision.ts` dan catat cara kerjanya saat ini: apakah memakai AABB dari `posisi` dan `ukuran` gedung, dan apakah pohon, lampu, pagar, dan bangku punya collider.
- Catat apakah karakter menabrak sudut dan langsung berhenti total (tidak meluncur di dinding).
- Catat apakah kamera First Person memakai near plane yang terlalu besar sehingga menembus dinding.
- Tulis ringkasan penyebab di awal laporan sebelum mengubah kode.

## 2. Geser di sepanjang dinding (wall sliding)
- Saat karakter menabrak dinding, pisahkan gerakan menjadi dua sumbu. Gerakkan sumbu X dan Z secara terpisah, dan hanya blokir sumbu yang menabrak.
- Dengan begitu, karakter meluncur di sepanjang dinding dan tidak berhenti total.
- Di sudut bangunan, gerakan diskrit per frame harus dicek ulang. Gunakan sub-langkah (misalnya maksimal 0,2 unit per sub-langkah) agar karakter tidak melompati dinding saat lari.

## 3. Collider untuk objek kecil
- Pohon: collider silinder kecil di batang, radius sekitar 0,6 unit. Tajuk tidak menjadi collider.
- Tiang lampu: collider silinder kecil, radius sekitar 0,3 unit.
- Bangku: collider kotak tipis, dan karakter boleh melewatinya jika tingginya di bawah 0,5 unit.
- Pagar keliling: collider garis tipis di sepanjang pagar, dengan celah di gerbang.
- Kolam: collider kotak. Karakter tidak boleh masuk ke dalam air.
- Simpan daftar collider ini di `campus.ts` atau berkas baru `data/colliders.ts`, dan jangan hardcode di komponen.

## 4. Naik trotoar dan tangga kecil
- Trotoar dan tepi jalan yang tingginya di bawah 0,4 unit boleh dinaiki tanpa berhenti.
- Gunakan langkah naik (step-up) sederhana: jika ada permukaan di depan yang tingginya di bawah 0,4 unit, karakter naik ke permukaan itu.

## 5. Kamera First Person
- Near plane kamera diatur ke 0,1 agar tidak menembus dinding saat kepala berada dekat dinding.
- Saat kamera mendekati dinding, pindahkan posisi kamera sedikit ke belakang atau ke depan agar tidak melewati dinding. Tidak boleh ada kamera di dalam bangunan.
- Gunakan raycast dari posisi kepala ke arah kamera. Jika ada dinding, pendekkan jarak kamera.

## 6. Pergerakan yang stabil
- Gunakan `delta` dari `useFrame`, dengan batas maksimum delta 0,05 detik agar karakter tidak melompat saat frame lambat.
- Hindari getaran: jangan ubah kecepatan secara tiba-tiba. Gunakan percepatan halus.
- Setelah berpindah mode dari Drone View ke First Person, karakter tidak boleh langsung berada di dalam bangunan. Jika posisi awal bertabrakan, dorong karakter ke titik terdekat yang kosong.

## 7. Tes yang harus lulus
- Berjalan lurus ke dinding gedung: karakter berhenti di dinding dan tidak menembus.
- Berjalan menyusuri dinding dengan sudut miring: karakter meluncur, tidak berhenti total.
- Berjalan melewati sudut bangunan dari dua arah: tidak tersangkut.
- Menabrak pohon dan tiang lampu: karakter mengitari, tidak menembus.
- Melewati gerbang sekolah: tidak tersangkut di pagar.
- Berjalan melewati trotoar: naik tanpa berhenti.
- Melihat dinding dari jarak dekat dengan kamera: kamera tidak menembus.
- Lari dengan Shift menyusuri dinding: tidak melompati dinding.

## 8. Yang tidak boleh berubah
- Mode Drone View dan Third Person tetap seperti sekarang, kecuali collider yang sama dipakai di Third Person.
- Fitur yang sudah ada tetap berfungsi: pencarian, teleport, rute, minimap, panel info, label, siang dan malam, panel sudut pandang, karakter, Sapa, dan multipemain.
- Jangan ubah posisi gedung dan data nama.

## 9. Batasan
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.
- Jangan commit, push, atau deploy tanpa konfirmasi.
```
