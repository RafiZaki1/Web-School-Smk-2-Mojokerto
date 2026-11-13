<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Kotak masuk petugas Bank Mini: satu baris per pembayaran online yang lunas.
     * Dipakai bersama oleh semua akun petugas (satu loket), sehingga status baca tidak per user.
     * transaksi_id unik supaya callback ganda tidak membuat notifikasi dobel.
     */
    public function up(): void
    {
        Schema::create('notifikasi_bank_mini', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaksi_id')->unique()->constrained('transaksi_bank_mini')->cascadeOnDelete();
            $table->string('judul', 150);
            $table->string('pesan');
            $table->timestamp('dibaca_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifikasi_bank_mini');
    }
};
