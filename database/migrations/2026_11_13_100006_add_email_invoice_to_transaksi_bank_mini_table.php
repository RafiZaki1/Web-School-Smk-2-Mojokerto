<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Email tujuan invoice per transaksi gateway. Diisi siswa saat checkout dan juga dikirim
     * ke Tripay sebagai customer_email, jadi instruksi bayar dan invoice lunas sampai ke siswa.
     */
    public function up(): void
    {
        Schema::table('transaksi_bank_mini', function (Blueprint $table) {
            $table->string('email_invoice', 100)->nullable()->after('siswa_id');
        });
    }

    public function down(): void
    {
        Schema::table('transaksi_bank_mini', function (Blueprint $table) {
            $table->dropColumn('email_invoice');
        });
    }
};
