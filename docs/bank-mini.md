# Bank Mini & Pembayaran SPP (Fase 1)

Portal Blade di backend Laravel. Menu publik: **Kesiswaan > Pembayaran SPP** (`frontend-next` `/pembayaran-spp`) meneruskan ke `{API}/bank-mini/login`.

| Area | URL | Login |
|---|---|---|
| Siswa | `/bank-mini/login` | NISN + password (default = NISN), guard `siswa` |
| Petugas | `/bank-mini/admin/login` | akun sendiri role `petugas_bank_mini` (username `bankmini`, seeder `BankMiniPetugasSeeder`) atau `admin`. Akun Tata Usaha (`admin_tu`) tidak bisa masuk Bank Mini |
| Wali kelas | `/bank-mini/wali-kelas/login` | akun role `wali_kelas`, dibuat petugas di menu **Akun Wali Kelas**; hanya melihat kelasnya |
| Callback Tripay | `POST /api/bank-mini/webhook` | HMAC-SHA256 body, middleware `tripay.signature` |

## Setup

```bash
php artisan migrate
php artisan db:seed --class=BankMiniPetugasSeeder   # akun petugas; set BANK_MINI_PETUGAS_PASSWORD di .env dulu
php artisan bank-mini:sync-siswa      # salin siswa XII angkatan aktif dari tabel graduates + isi password NISN
php artisan bank-mini:init-password   # isi password NISN untuk siswa yang password-nya masih null
```

Lalu buka **Generate Tagihan** di panel petugas untuk membuat 12 bulan (Juli–Juni) per siswa. Generate bisa dijalankan ulang; bulan yang sudah ada dilewati.

`.env` (key Tripay sama dengan api-getskill):

```
TRIPAY_API_KEY=  TRIPAY_PRIVATE_KEY=  TRIPAY_MERCHANT_CODE=
TRIPAY_API_URL=https://tripay.co.id/api-sandbox/   # produksi: https://tripay.co.id/api/
BANK_MINI_GATEWAY_EXPIRY_HOURS=24
BANK_MINI_CUSTOMER_EMAIL=tu@smkn2mojokerto.sch.id  # Tripay wajib email; siswa belum punya email
```

Callback URL di dashboard Tripay: `{APP_URL}/api/bank-mini/webhook`. Jadwalkan `php artisan schedule:run` (cron tiap menit) supaya `bank-mini:lepas-kedaluwarsa` melepas kode bayar yang kedaluwarsa.

## Setelah pembayaran online lunas

Siswa mengisi **email invoice** saat checkout (disimpan di `transaksi_bank_mini.email_invoice`, juga dikirim ke Tripay sebagai `customer_email`). Saat status menjadi settlement (callback atau tombol cek status), event `PembayaranSppLunas` didispatch sekali setelah commit:

- `CatatNotifikasiPetugas` (sinkron): baris baru di `notifikasi_bank_mini`, tampil di lonceng panel petugas (polling 30 detik, `GET /bank-mini/admin/notifikasi`).
- `KirimInvoiceSpp` (queue): email invoice `InvoiceSppMail` ke siswa. Butuh `php artisan queue:work` dan `MAIL_*` di `.env` terisi SMTP sungguhan.

## Monitoring petugas

Filter: **jurusan**, **kelas**, dan **status sampai bulan ini** (sudah lunas / belum lunas). Lunas = semua bulan yang sudah jatuh tempo pada tahun ajaran terpilih sudah dibayar; bulan pending ikut dihitung belum lunas, bulan yang belum jatuh tempo tidak dihitung.

- Tanpa kelas: rekap per kelas (wali kelas, siswa, persentase bulan lunas, siswa belum lunas, tunggakan, status kelas).
- Dengan kelas: matriks 12 bulan siswa kelas itu, disaring status siswa, dengan tombol bayar tunai. Wali kelas mendapat tab status yang sama di dasbornya.

## Wali kelas

- Petugas membuka **Akun Wali Kelas**, memilih guru dari data guru (opsional), mengisi username, lalu membuat password (tombol *Buat acak*). Username dan password ditampilkan sekali untuk diberikan ke wali kelas.
- Satu kelas punya satu akun wali kelas (tabel `wali_kelas`: `kelas` unik, `user_id` unik). Hapus akun = wali kelas tidak bisa login lagi.
- Wali kelas melihat dasbor kelas (matriks 12 bulan, tunggakan, tabungan), riwayat pembayaran siswanya, dan kwitansi siswa di kelasnya saja. Tidak bisa mencatat pembayaran atau membuka halaman petugas (403).
- Lupa password: petugas membuka akun kelas tersebut dan mengisi password baru.

## Aturan bisnis

- Iuran Rp 225.000/bulan = SPP Rp 175.000 + tabungan Rp 50.000 (`config/bank_mini.php`), nominal disalin ke tiap baris tagihan.
- Checkout gateway: bulan dikunci `pending` dengan UPDATE bersyarat, transaksi + rincian dibuat, lalu Tripay dipanggil. Bila Tripay gagal semuanya di-rollback.
- Callback/cek status: status transaksi diubah satu UPDATE bersyarat pada status lama (idempoten, tanpa `lockForUpdate`). Nominal callback wajib = SPP + biaya admin channel.
- Tunai di loket: bulan langsung `lunas`, transaksi langsung `settlement`, petugas tercatat.
- Tabungan fase 1 = `SUM(porsi_tabungan)` transaksi settlement. Titik sambung fase 2 ditandai `TODO: Phase 2 Hook` di `MenerapkanStatusGateway` dan `AdminBankMiniController::bayarTunai`.

## Catatan produksi

- Tampilan memakai Tailwind Play CDN + Alpine CDN karena backend belum punya pipeline Vite untuk Blade. Ganti ke build Vite sebelum rilis.
- Pastikan `SESSION_SECURE_COOKIE=true` di HTTPS.
