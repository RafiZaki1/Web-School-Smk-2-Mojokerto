# Perapian Tata Letak Blok Peta 3D (Aula, XII KUL, XII APHP, & Deretan Timur X APHP)
- Tanggal: 2026-11-16
- Versi: 1
- Menggantikan: -
- Dipakai untuk: frontend-next/src/features/peta-3d/data/campus.ts, frontend-next/src/features/peta-3d/components/Environment.tsx

```text
Rapikan tata letak blok di halaman Peta 3D `frontend-next` (route `/peta-3d` dan `/id/peta-3d`). Ubah hanya data posisi di `frontend-next/src/features/peta-3d/data/campus.ts` dan, jika perlu, nilai jalan di `Environment.tsx`. Jangan ubah komponen lain kecuali diperlukan. Simpan prompt ini ke `docs/prompts/peta-3d-tata-letak-v1.md` dan tulis entri di `docs/CHANGELOG.md`.

## 1. Pindahkan blok di depan Aula ke belakang Aula
- Blok XII KUL 1, XII KUL 2, dan XII KUL 3 saat ini berada di depan Aula (sisi selatan, menghadap jalan utama). Pindahkan ketiganya ke belakang Aula (sisi utara), sejajar dengan bangunan Aula.
- Jaga urutan dari kiri ke kanan tetap sama: KUL 1, KUL 2, KUL 3.
- Setelah dipindah, bagian depan Aula harus kosong agar halaman terlihat lebih lega, dan Aula menghadap ke jalan utama.
- Pastikan rute dari gerbang ke Aula masih ada. Perbarui field `rute` pada gedung terkait jika jalurnya berubah.

## 2. Beri jarak untuk jalan kecil
- Antara blok belakang Aula dan blok lain di sekitarnya, sisakan jarak minimal 4 unit untuk jalan kecil.
- Tambahkan jalan kecil ini sebagai mesh abu-abu di `Environment.tsx` dengan lebar sekitar 4 unit. Hubungkan ke jalan utama yang sudah ada.
- Pastikan jalan kecil tidak menabrak bangunan, dan tidak memotong pagar keliling.
- Jika perlu, geser blok tetangga sedikit agar jarak minimal 4 unit terpenuhi.

## 3. Deretan kelas XII APHP
- Rapikan deretan XII APHP agar tersusun dalam satu baris lurus dengan jarak yang sama antar blok.
- Jaga agar label setiap blok tetap terlihat dan tidak saling menutupi.

## 4. Pindahkan X APHP ke deretan timur, di samping XII DKV 1
- Blok X APHP (X APHP 1 dan X APHP 2) dipindah ke deretan timur, tepat di samping XII DKV 1.
- Urutan dari atas ke bawah pada deretan timur: XII DKV 1, lalu X APHP 1, lalu X APHP 2.
- Pastikan ukuran dan warna blok X APHP tetap sesuai jurusan APHP (oranye atau peach), bukan warna DKV.
- Jika ruang di deretan timur tidak cukup, geser deretan itu sedikit ke timur, jangan sampai keluar dari `CAMPUS_BOUNDS`.

## 5. Batasan
- Jangan mengubah `id` gedung. Hanya ubah `posisi` dan `rotasi` jika perlu.
- Jangan ubah nama, jurusan, atau deskripsi gedung.
- Jangan hapus fitur yang sudah ada: pencarian, teleport, rute, minimap, panel info, label, siang dan malam, panel sudut pandang, dan multipemain.
- Tanpa pola titik sebagai ornamen.
- Jalankan lint dan `npx tsc --noEmit`. Tidak boleh ada error di folder peta-3d.
- Jangan commit atau push.
```
