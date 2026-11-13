<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Transaksi pembayaran SPP, tunai di loket Bank Mini maupun lewat Tripay.
     * order_id = merchant_ref yang dikirim ke Tripay; reference = nomor referensi dari Tripay.
     * Tabungan siswa fase 1 dihitung dari SUM(porsi_tabungan) transaksi settlement.
     */
    public function up(): void
    {
        Schema::create('transaksi_bank_mini', function (Blueprint $table) {
            $table->id();
            $table->string('order_id', 64)->unique();
            $table->string('reference', 64)->nullable()->unique();
            $table->foreignId('siswa_id')->constrained('siswa')->cascadeOnDelete();
            $table->string('metode', 20)->index();
            $table->string('channel', 30)->nullable();
            $table->string('channel_nama', 100)->nullable();
            $table->unsignedInteger('total_nominal');
            $table->unsignedInteger('porsi_spp');
            $table->unsignedInteger('porsi_tabungan');
            $table->unsignedInteger('biaya_admin')->default(0);
            $table->string('status', 20)->default('pending')->index();
            $table->string('pay_code', 100)->nullable();
            $table->string('checkout_url')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('paid_at')->nullable()->index();
            $table->foreignId('petugas_id')->nullable()->constrained('users')->nullOnDelete();
            $table->json('gateway_payload')->nullable();
            $table->timestamps();

            $table->index(['siswa_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_bank_mini');
    }
};
