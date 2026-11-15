<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jejak keputusan petugas/admin atas transaksi (setujui, tolak, batalkan): siapa, kapan,
     * dan catatannya. Status baru (paid, rejected, canceled) memakai kolom status yang sudah ada.
     */
    public function up(): void
    {
        Schema::table('transaksi_bank_mini', function (Blueprint $table) {
            $table->foreignId('verifikator_id')->nullable()->after('petugas_id')->constrained('users')->nullOnDelete();
            $table->timestamp('diverifikasi_at')->nullable()->after('verifikator_id');
            $table->string('catatan_verifikasi')->nullable()->after('diverifikasi_at');
        });
    }

    public function down(): void
    {
        Schema::table('transaksi_bank_mini', function (Blueprint $table) {
            $table->dropConstrainedForeignId('verifikator_id');
            $table->dropColumn(['diverifikasi_at', 'catatan_verifikasi']);
        });
    }
};
