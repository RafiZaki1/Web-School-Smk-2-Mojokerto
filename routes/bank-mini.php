<?php

use App\Enums\RoleEnum;
use App\Http\Controllers\BankMini\AdminBankMiniController;
use App\Http\Controllers\BankMini\AdminMonitoringController;
use App\Http\Controllers\BankMini\AdminNotifikasiController;
use App\Http\Controllers\BankMini\AdminPembayaranController;
use App\Http\Controllers\BankMini\AdminStatusLayananController;
use App\Http\Controllers\BankMini\AdminVerifikasiController;
use App\Http\Controllers\BankMini\AdminWaliKelasController;
use App\Http\Controllers\BankMini\AksesAdminController;
use App\Http\Controllers\BankMini\BankMiniAdminAuthController;
use App\Http\Controllers\BankMini\KwitansiController;
use App\Http\Controllers\BankMini\PortalRiwayatController;
use App\Http\Controllers\BankMini\PortalSppController;
use App\Http\Controllers\BankMini\SiswaAuthController;
use App\Http\Controllers\BankMini\WaliKelasController;
use Illuminate\Support\Facades\Route;

/*
 * Portal Bank Mini & Pembayaran SPP (Blade + sesi). Dimuat dari routes/web.php sehingga
 * memakai middleware grup web (sesi, CSRF). Callback Tripay ada di routes/api.php.
 * Halaman = GET Blade; aksi tulis = JSON (ApiRequest + ResponseHelper) yang dipanggil fetch().
 */
Route::prefix('bank-mini')->name('bank-mini.')->group(function () {
    Route::redirect('/', '/bank-mini/dasbor');

    // Siswa. bank-mini.buka mengganti semua halaman siswa dengan pengumuman saat layanan ditutup petugas.
    Route::middleware(['bank-mini.buka', 'guest:siswa'])->group(function () {
        Route::get('/login', [SiswaAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [SiswaAuthController::class, 'login'])->middleware('throttle:10,1')->name('login.submit');
    });

    Route::post('/logout', [SiswaAuthController::class, 'logout'])->middleware('auth:siswa')->name('logout');

    Route::middleware(['bank-mini.buka', 'auth:siswa'])->group(function () {
        Route::get('/dasbor', [PortalSppController::class, 'dashboard'])->name('dashboard');
        Route::post('/checkout', [PortalSppController::class, 'checkoutGateway'])->middleware('throttle:10,1')->name('checkout');
        Route::post('/transaksi/{orderId}/cek-status', [PortalSppController::class, 'cekStatus'])->middleware('throttle:20,1')->name('transaksi.cek-status');

        Route::get('/riwayat', [PortalRiwayatController::class, 'riwayatTransaksi'])->name('riwayat');
        Route::get('/transaksi/{orderId}', [PortalRiwayatController::class, 'detailTransaksi'])->name('transaksi.show');
        Route::get('/kartu-spp', [PortalRiwayatController::class, 'kartuSpp'])->name('kartu');
        Route::get('/kwitansi/{orderId}', [KwitansiController::class, 'siswa'])->name('kwitansi');

        Route::put('/password', [SiswaAuthController::class, 'updatePassword'])->middleware('throttle:10,1')->name('password');
    });

    // Login staf bersama (petugas & wali kelas), guard web
    Route::post('/admin/login', [BankMiniAdminAuthController::class, 'login'])->middleware(['guest:web', 'throttle:10,1'])->name('admin.login.submit');

    // Petugas loket Bank Mini (akun sendiri, terpisah dari Tata Usaha) dan admin
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/login', [BankMiniAdminAuthController::class, 'showLogin'])->middleware('guest:web')->name('login');
        Route::get('/sso/{user}', [AksesAdminController::class, 'masuk'])->whereNumber('user')->middleware('signed')->name('sso');

        Route::middleware(['auth:web', 'bank-mini.role:'.RoleEnum::ADMIN->value.','.RoleEnum::PETUGAS_BANK_MINI->value])->group(function () {
            Route::redirect('/', '/bank-mini/admin/monitoring');
            Route::get('/monitoring', [AdminMonitoringController::class, 'index'])->name('monitoring');
            Route::post('/bayar-tunai', [AdminBankMiniController::class, 'bayarTunai'])->name('bayar-tunai');
            Route::get('/tagihan', [AdminBankMiniController::class, 'halamanTagihan'])->name('tagihan');
            Route::post('/tagihan', [AdminBankMiniController::class, 'generateTagihan'])->name('tagihan.generate');
            Route::get('/laporan-kas', [AdminBankMiniController::class, 'laporanKas'])->name('laporan');
            Route::get('/kwitansi/{orderId}', [KwitansiController::class, 'admin'])->name('kwitansi');
            Route::get('/notifikasi', [AdminNotifikasiController::class, 'index'])->name('notifikasi');
            Route::post('/notifikasi/baca', [AdminNotifikasiController::class, 'bacaSemua'])->name('notifikasi.baca');

            // Log pembayaran + kendali manual. Batalkan hanya untuk admin (dicek AksiVerifikasiEnum).
            Route::get('/pembayaran', [AdminPembayaranController::class, 'index'])->name('pembayaran');
            Route::post('/pembayaran/{orderId}/cek-status', [AdminPembayaranController::class, 'cekStatus'])->middleware('throttle:30,1')->name('pembayaran.cek-status');
            Route::post('/pembayaran/{orderId}/setujui', [AdminVerifikasiController::class, 'setujui'])->name('pembayaran.setujui');
            Route::post('/pembayaran/{orderId}/batalkan', [AdminVerifikasiController::class, 'batalkan'])->name('pembayaran.batalkan');

            Route::get('/layanan', [AdminStatusLayananController::class, 'index'])->name('layanan');
            Route::put('/layanan', [AdminStatusLayananController::class, 'simpan'])->name('layanan.simpan');

            Route::get('/wali-kelas', [AdminWaliKelasController::class, 'index'])->name('wali-kelas');
            Route::put('/wali-kelas/{kelas}', [AdminWaliKelasController::class, 'simpan'])->name('wali-kelas.simpan');
            Route::delete('/wali-kelas/{kelas}', [AdminWaliKelasController::class, 'hapus'])->name('wali-kelas.hapus');

            Route::put('/password', [BankMiniAdminAuthController::class, 'updatePassword'])->middleware('throttle:10,1')->name('password');
            Route::post('/logout', [BankMiniAdminAuthController::class, 'logout'])->name('logout');
        });
    });

    // Wali kelas: pantau pembayaran kelasnya sendiri (baca saja)
    Route::prefix('wali-kelas')->name('walas.')->group(function () {
        Route::get('/login', [BankMiniAdminAuthController::class, 'showLoginWaliKelas'])->middleware('guest:web')->name('login');

        Route::middleware(['auth:web', 'bank-mini.role:'.RoleEnum::WALI_KELAS->value])->group(function () {
            Route::redirect('/', '/bank-mini/wali-kelas/dasbor');
            Route::get('/dasbor', [WaliKelasController::class, 'dashboard'])->name('dashboard');
            Route::get('/riwayat', [WaliKelasController::class, 'riwayat'])->name('riwayat');
            Route::get('/kwitansi/{orderId}', [KwitansiController::class, 'waliKelas'])->name('kwitansi');
            Route::put('/password', [BankMiniAdminAuthController::class, 'updatePassword'])->middleware('throttle:10,1')->name('password');
            Route::post('/logout', [BankMiniAdminAuthController::class, 'logout'])->name('logout');
        });
    });
});
