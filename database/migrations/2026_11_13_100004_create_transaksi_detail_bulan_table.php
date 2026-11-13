<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Bulan-bulan tagihan yang dibayar dalam satu transaksi.
     */
    public function up(): void
    {
        Schema::create('transaksi_detail_bulan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaksi_id')->constrained('transaksi_bank_mini')->cascadeOnDelete();
            $table->foreignId('tagihan_spp_id')->constrained('tagihan_spp')->cascadeOnDelete();
            $table->unsignedInteger('nominal_spp');
            $table->unsignedInteger('nominal_tabungan');
            $table->timestamps();

            $table->unique(['transaksi_id', 'tagihan_spp_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_detail_bulan');
    }
};
